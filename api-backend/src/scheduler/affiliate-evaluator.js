import { db } from '../../drizzle/db.js';
import { affiliateUser, affiliateReferral, affiliateApplication, partnerLead } from '../../drizzle/schema.js';
import { eq, and, sql, gte, isNull } from 'drizzle-orm';
import logger from '../../utils/logger.js';
import dayjs from 'dayjs';
import {
  evaluatePartnerPerformanceTerminations,
} from '../partner/partner.service.js';
import { getActivePerformanceSetting, getPerformanceLeaderboardForPeriod } from '../partner/partner.repository.js';
import { runDailyCronRules, runMonthlyCronRules, formatPeriod } from '../partner/commission-rule.engine.js';
import { getMailjetLeadRecipients, sendMailjetEmail } from '../email/mailjet.client.js';

const THRESHOLD_3_MONTHS = 35000;
const THRESHOLD_1_YEAR = 500000;

/**
 * Check if a partner is using the new portal system (has partner_lead records).
 * Partners on the new system are evaluated by evaluatePartnerPerformanceTerminations
 * using partner_lead data, so they should be skipped from the legacy
 * affiliate_referral-based 3-month/1-year evaluation to avoid false positives.
 */
const isUsingNewPartnerPortal = async (affiliateId) => {
  const [row] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(partnerLead)
    .where(eq(partnerLead.affiliateId, affiliateId));
  return (row?.count || 0) > 0;
};

export const runAffiliateEvaluations = async () => {
  logger.info("Running affiliate performance evaluations CRON...");
  try {
    await evaluatePartnerPerformanceTerminations({
      notifyAdmin: async ({ partnerName, partnerEmail, closedClients, minimumClosedClients, dueAt }) => {
        const recipients = getMailjetLeadRecipients();
        if (!recipients.to) {
          logger.warn("No admin notification recipients configured for partner performance alert.");
          return;
        }

        await sendMailjetEmail({
          ...recipients,
          subject: "Partner performance termination warning",
          htmlPart: `
            <h2>Partner performance warning</h2>
            <p>${partnerName} (${partnerEmail}) closed ${closedClients} client(s), below the required ${minimumClosedClients}.</p>
            <p>Auto termination is scheduled after the grace period: ${dueAt.toISOString()}.</p>
          `,
        });
      },
    });

    // ── Commission Rule Engine ──────────────────────────────────────────────
    const now = new Date();
    // Fetch all approved partners for engine evaluation
    let approvedPartners = [];
    try {
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      approvedPartners = await getPerformanceLeaderboardForPeriod(periodStart, periodEnd, 10000);
    } catch (err) {
      logger.error("[commission-engine] Failed to load approved partners:", err);
    }

    // Daily cron rules (includes initial commission logic)
    try {
      const dailyResult = await runDailyCronRules({ partners: approvedPartners, now });
      if (dailyResult?.created > 0) {
        logger.info(`[commission-engine] daily_cron: Created ${dailyResult.created} commission record(s).`);
      }
    } catch (err) {
      logger.error("[commission-engine] daily_cron evaluation failed:", err);
    }

    // Monthly cron rules — only run on the configured payout date
    try {
      const setting = await getActivePerformanceSetting();
      const payoutDay = Number(setting?.monthlyPayoutDate || 25);
      if (now.getDate() === payoutDay) {
        const monthlyResult = await runMonthlyCronRules({ partners: approvedPartners, now });
        if (monthlyResult?.created > 0) {
          logger.info(
            `[commission-engine] monthly_cron: Created ${monthlyResult.created} commission record(s) for ${formatPeriod(now)}.`,
          );
        }
      }
    } catch (err) {
      logger.error("[commission-engine] monthly_cron evaluation failed:", err);
    }

    // Get all active affiliate users
    const activeAffiliates = await db
      .select({
        userId: affiliateUser.id,
        affiliateId: affiliateUser.affiliateId,
        createdAt: affiliateUser.createdAt,
        email: affiliateUser.email,
        isActive: affiliateUser.isActive,
      })
      .from(affiliateUser)
      .where(eq(affiliateUser.isActive, true));

    for (const affiliate of activeAffiliates) {
      if (!affiliate.createdAt) continue;

      // GUARD: Skip legacy revenue-based evaluation for partners using
      // the new partner portal. They are evaluated via partner_lead data
      // inside evaluatePartnerPerformanceTerminations above.
      const onNewPortal = await isUsingNewPartnerPortal(affiliate.affiliateId);
      if (onNewPortal) {
        continue;
      }

      const now = dayjs();
      const start = dayjs(affiliate.createdAt);
      const monthsActive = now.diff(start, 'month');

      // Get lifetime revenue for this affiliate (legacy affiliate_referral system)
      const [stats] = await db
        .select({
            totalRevenue: sql`COALESCE(SUM(${affiliateReferral.purchaseAmount}), 0)`.mapWith(Number)
        })
        .from(affiliateReferral)
        .where(eq(affiliateReferral.affiliateId, affiliate.affiliateId));

      const revenue = stats.totalRevenue || 0;

      // 1-Year Evaluation (legacy)
      if (monthsActive >= 12 && revenue < THRESHOLD_1_YEAR) {
        logger.info(`[legacy] Affiliate ${affiliate.email} failed 1-year evaluation ($${revenue} < $${THRESHOLD_1_YEAR}). Suspending...`);
        await suspendAffiliate(affiliate.userId, affiliate.affiliateId, "Failed 1-Year Revenue Target ($500K)");
        continue;
      }

      // 3-Month Evaluation (legacy)
      if (monthsActive >= 3 && monthsActive < 12 && revenue < THRESHOLD_3_MONTHS) {
        logger.info(`[legacy] Affiliate ${affiliate.email} failed 3-month evaluation ($${revenue} < $${THRESHOLD_3_MONTHS}). Suspending...`);
        await suspendAffiliate(affiliate.userId, affiliate.affiliateId, "Failed 3-Month Revenue Target ($35K)");
        continue;
      }
    }
  } catch (error) {
    logger.error("Failed to run affiliate evaluations:", error);
  }
};

const suspendAffiliate = async (userId, affiliateId, reason) => {
    // 1. Suspend User Login
    await db.update(affiliateUser).set({ isActive: false, updatedAt: new Date() }).where(eq(affiliateUser.id, userId));
    // 2. Set App Status to 'rejected' / suspended
    await db.update(affiliateApplication).set({ status: 'rejected', notes: reason, updatedAt: new Date() }).where(eq(affiliateApplication.id, affiliateId));
};
