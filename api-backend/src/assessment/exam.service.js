import { db } from '../../drizzle/db.js';
import { assessmentSession, affiliateApplication, affiliateBatch, assessmentQuestion, assessmentAnswer, assessmentAuditLog, trainingContent } from '../../drizzle/schema.js';
import { eq, desc, and, or, sql, lt, gte, isNull, inArray, asc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import logger from '../../utils/logger.js';
import {
  getBatchById,
  getBatchesByIds,
  listBatchesEligibleForAutoCurate,
  updateBatchAiScreeningRuntimeState,
  updateBatchAiScreeningSummary,
} from '../affiliate-batch/batch.repository.js';
import {
  sendTrainingInvitationEmail,
  sendVideoInterviewInvitationEmail,
  sendExamInvitationEmail,
  sendExamFailedFinalEmail,
} from '../email/email.service.js';
import { getAssessmentSettings } from './assessment.repository.js';
import { buildSecurityAssessment, normalizeIp } from './exam-security.service.js';
import { queueBackgroundTask } from '../utils/background-task.js';
import { publishExamResult } from './exam-result-events.js';
import { broadcastBackofficeBatchUpdate } from '../affiliate-batch/batch-sse.js';
import { findMetasByTarget } from '../meta/meta.repository.js';

const BATCH_SIZE = Number(process.env.AI_SCREENING_BATCH_SIZE || 10);
const EXAM_EXPIRY_HOURS = Number(process.env.EXAM_EXPIRY_HOURS || 48);
const AI_TRAINING_BASE_URL = (process.env.AI_TRAINING_BASE_URL || 'http://localhost:3006').replace(/\/$/, '');
const DEFAULT_MAX_EXAM_ATTEMPTS = 2;
const RECRUITMENT_BATCH_META_TYPE = 'affiliate_batch';
const BATCH_TRAINING_MATERIAL_IDS_META_KEY = 'recruitment_training_material_ids';
const EXAM_RESULT_RECOVERY_STALE_MS = 10 * 60 * 1000;
const EXAM_RESULT_RECOVERY_COOLDOWN_MS = 5 * 60 * 1000;
const MAX_EXAM_RESULT_RECOVERY_ATTEMPTS = 2;

const emitBackofficeBatchUpdate = async (batchId) => {
  if (!batchId) return;
  const batch = await getBatchById(batchId);
  if (batch) {
    broadcastBackofficeBatchUpdate(batch);
  }
};

const emitBackofficeBatchUpdates = async (batchIds = []) => {
  for (const batchId of [...new Set(batchIds.filter(Boolean))]) {
    await emitBackofficeBatchUpdate(batchId);
  }
};

const AI_SOLUTION_OVERVIEW = [
  {
    id: 'home-brand-positioning',
    title: '1. Brand Positioning From The Homepage',
    description:
      'Digital PA is positioned as a digital growth partner for businesses that want expert execution across marketing, content, design, user experience, website delivery, and AI-enabled automation. The homepage communicates a full-service capability rather than a single isolated offer.',
  },
  {
    id: 'home-core-value',
    title: '2. Core Value Proposition',
    bullets: [
      'Reduce workload for business owners by handling specialist execution across multiple growth functions.',
      'Improve ROI through clearer strategy, better campaigns, stronger assets, and more consistent execution.',
      'Provide businesses with a reliable partner that can combine strategic thinking and hands-on delivery.',
    ],
  },
  {
    id: 'homepage-service-roles',
    title: '3. Core Specialist Roles Highlighted On The Homepage',
    bullets: [
      'Marketing Manager: reduces owner overwhelm and improves campaign coordination.',
      'Copywriter: creates persuasive messaging that converts attention into action.',
      'Ads Specialist: helps businesses reach the right audience through paid distribution.',
      'Creative Designer: strengthens first impressions and brand storytelling through visuals.',
      'UI/UX Specialist: improves product or website usability and conversion performance.',
      'Skilled Web Developers: turn ideas into fast, responsive, and maintainable websites.',
    ],
  },
  {
    id: 'service-catalogue-overview',
    title: '4. Service Catalogue Overview',
    bullets: [
      'Ads Campaign Services: SEM, SEO, and SEO copywriting.',
      'Content Marketing Services: blog article writing, content marketing strategy, copywriting, infographic content, skyscraper content, and social media content.',
      'Social Media Marketing Services: paid social ads and social media management.',
      'Website Development Services: website design & development and website maintenance.',
      'AI Solutions: AI automation and AI-enabled marketing automation.',
      'Software Development Services: custom software development, including JavaScript, Next.js, and Node.js-based solutions.',
    ],
  },
  {
    id: 'ai-platform-positioning',
    title: '5. AI Solutions Positioning',
    description:
      'DIGITAL-PA AI Solutions is positioned as an all-in-one business marketing, CRM, and automation platform for SME owners. The platform is designed to help businesses capture leads, drive sales, nurture customer relationships, automate repetitive work, and improve day-to-day execution from one connected system.',
  },
  {
    id: 'ai-core-promise',
    title: '6. AI Solutions Core Promise',
    bullets: [
      'Replace fragmented tools with one connected operating system for marketing, sales, and follow-up.',
      'Give small teams enterprise-style automation without the cost and complexity of a large custom stack.',
      'Help owners and operators move faster, follow up consistently, and see what is actually driving growth.',
    ],
  },
  {
    id: 'ai-problems',
    title: '7. AI Solutions Common Business Problems',
    bullets: [
      'Fragmented automation across CRM, WhatsApp, email, and spreadsheets that still requires manual work.',
      'Overpriced agencies with unclear reporting and delayed outcomes.',
      'Low visibility into growth, lead quality, and campaign performance.',
    ],
  },
  {
    id: 'ai-ideal-fit',
    title: '8. AI Solutions Ideal-Fit Buyers',
    bullets: [
      'Marketing agencies that need better lead handling, follow-up, and client operations.',
      'Sales teams and sales professionals who want a clearer pipeline and faster response workflows.',
      'Local service businesses such as contractors, law firms, dentists, chiropractors, and similar operators.',
      'B2B companies, coaches, consultants, real estate agents, and e-commerce brands that need stronger lead management.',
      'Solopreneurs and small teams that want enterprise-level capability without enterprise-level overhead.',
    ],
  },
  {
    id: 'ai-buyer-signals',
    title: '9. AI Solutions Best-Fit Buyer Signals',
    bullets: [
      'They are using too many disconnected tools and still relying on manual admin.',
      'They struggle to respond to leads consistently or fast enough.',
      'They want better conversion, retention, and visibility but do not want another bloated system.',
      'They need a practical, usable platform rather than a complicated transformation project.',
    ],
  },
  {
    id: 'ai-key-functions',
    title: '10. AI Solutions Key Functions',
    bullets: [
      'CRM and sales automation to manage leads and follow-ups.',
      'Marketing automation through email, SMS, and workflow campaigns.',
      'AI-assisted conversations and booking automation.',
      'Lead capture through forms, landing pages, and scheduling.',
      'Pipeline, payment, and reporting tools to close and retain customers.',
    ],
  },
  {
    id: 'ai-operational-impact',
    title: '11. AI Solutions Operational Impact',
    bullets: [
      'Capture leads using forms, landing pages, and scheduling flows.',
      'Nurture leads with voicemail, email, SMS, and two-way communication.',
      'Automate conversations with AI-assisted booking and tailored follow-up.',
      'Create courses, membership experiences, or community spaces to educate and retain customers.',
      'Manage workflows, pipeline progression, payments, and reporting in one place.',
    ],
  },
  {
    id: 'ai-modules',
    title: '12. AI Solutions Modules To Remember',
    bullets: [
      'CRM & Sales Automation: centralize lead stages, activities, and follow-up.',
      'Marketing Automation: run campaigns and trigger communication at the right time.',
      'Reputation Management: support visibility and trust in the digital space.',
      'Integrations: connect with existing tools so businesses do not need to rebuild everything from zero.',
    ],
  },
  {
    id: 'ai-business-outcomes',
    title: '13. AI Solutions Business Outcomes',
    bullets: [
      'Reduce lead cost, manpower cost, and cost per acquisition.',
      'Increase productivity, response speed, and sales efficiency.',
      'Grow revenue, re-engage past clients, and improve customer lifetime value.',
    ],
  },
  {
    id: 'ads-campaign-services',
    title: '14. Ads Campaign Services',
    description:
      'This category focuses on search visibility, paid demand capture, and traffic growth. It is most relevant for businesses that need stronger discoverability, better click quality, and clearer lead generation from search intent.',
    bullets: [
      'Search Engine Marketing (SEM): paid search campaigns to maximize visibility and targeted traffic.',
      'Search Engine Optimization (SEO): organic ranking improvement through stronger search strategy and technical visibility.',
      'SEO Copywriting: optimized written content that balances search performance with conversion clarity.',
    ],
  },
  {
    id: 'content-marketing-services',
    title: '15. Content Marketing Services',
    description:
      'This category focuses on content assets that educate, persuade, rank, and build brand trust over time. It is best for brands that need a stronger content engine to attract and nurture their audience.',
    bullets: [
      'Blog Article: expert-led blog resources that educate, attract traffic, and support authority building.',
      'Content Marketing: strategic content planning aligned to audience intent and business goals.',
      'Copywriting: persuasive brand-focused messaging for websites, campaigns, and conversion assets.',
      'Infographic Content: visual storytelling that makes complex information easier to understand and share.',
      'Skyscraper Content: comprehensive, high-quality long-form assets built to dominate a niche.',
      'Social Media Content: thumb-stopping branded content built for ongoing audience engagement.',
    ],
  },
  {
    id: 'social-media-marketing-services',
    title: '16. Social Media Marketing Services',
    description:
      'This category focuses on audience growth, engagement, paid amplification, and ongoing platform presence. It is best for brands that need stronger visibility and consistent communication across social channels.',
    bullets: [
      'Paid Social Ads: strategic campaign management across Facebook, Instagram, LinkedIn, and similar channels to maximize ROI.',
      'Social Media Management: strategy, content planning, and community management across major platforms.',
    ],
  },
  {
    id: 'website-services',
    title: '17. Website Development Services',
    description:
      'This category focuses on the business website as a revenue and credibility asset. It matters most for companies that need a stronger web presence, better user experience, and stable long-term site performance.',
    bullets: [
      'Website Design & Development: responsive business websites that align with goals and are built to perform.',
      'Website Maintenance: ongoing updates, security, support, and reliability to keep sites fast and current.',
    ],
  },
  {
    id: 'software-services',
    title: '18. Software Development Services',
    description:
      'This category focuses on custom digital product and system delivery for businesses that need functionality beyond standard marketing assets. It supports scalable implementation and technical problem-solving.',
    bullets: [
      'Custom Software Development: tailored product or business system delivery.',
      'JavaScript Development: high-performance web and application delivery with modern JavaScript.',
      'Next.js Development: SEO-friendly, production-grade React application delivery.',
      'Node.js Development: backend systems, APIs, and scalable server-side implementation.',
    ],
  },
  {
    id: 'service-categories-when-to-sell',
    title: '19. When To Recommend Each Category',
    bullets: [
      'Recommend Ads Campaign services when the buyer needs faster demand capture and measurable traffic growth.',
      'Recommend Content Marketing when the buyer needs stronger education, authority, and inbound trust building.',
      'Recommend Social Media Marketing when the buyer needs better visibility, engagement, and consistent brand activity.',
      'Recommend Website services when the buyer’s site is outdated, underperforming, or failing to convert.',
      'Recommend AI Solutions when the buyer’s problem is operational inefficiency, fragmented follow-up, or inconsistent lead handling.',
      'Recommend Software Development when the buyer needs custom workflows, deeper functionality, or product-level implementation.',
    ],
  },
  {
    id: 'sales-narrative',
    title: '20. Practical Sales Narrative',
    bullets: [
      'The conversation is not just about software features. It is about solving wasted time, missed leads, weak follow-up, and poor visibility.',
      'For non-AI services, anchor the discussion on business outcomes such as visibility, conversion, trust, consistency, and delivery quality.',
      'Position Digital PA as a practical growth partner that combines specialist execution with measurable business outcomes.',
      'Lead with outcomes first, then connect those outcomes to the module or workflow that makes them possible.',
    ],
  },
  {
    id: 'discovery-questions',
    title: '21. Discovery Questions To Use',
    bullets: [
      'Which area is currently the biggest bottleneck: traffic, conversion, content, follow-up, or website performance?',
      'How are you currently capturing and following up with leads?',
      'Which parts of your sales or marketing process still depend on manual work?',
      'Where do leads get lost today: response time, nurturing, booking, or closing?',
      'Do you currently have one dashboard that shows what is working and what is not?',
    ],
  },
  {
    id: 'documentation-summary',
    title: '22. Documentation Summary',
    description:
      'In summary, the end-user site presents Digital PA as a broad capability partner covering marketing strategy, ads, content, social, design, UX, websites, AI automation, and custom software. The strongest internal understanding for a trainee is this: Digital PA does not sell isolated tactics first, it sells clearer growth, better execution, stronger conversion, and more operational efficiency through the right service mix.',
  },
];

const normalizeBatchQuestionIds = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => String(item || "").trim()).filter(Boolean))];
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? [...new Set(parsed.map((item) => String(item || "").trim()).filter(Boolean))]
        : [];
    } catch {
      return [];
    }
  }
  return [];
};

const getBatchQuestionSetForSession = async (sessionId) => {
  const rows = await db
    .select({
      interviewQuestionIds: affiliateBatch.interviewQuestionIds,
      examQuestionIds: affiliateBatch.examQuestionIds,
    })
    .from(assessmentSession)
    .leftJoin(affiliateApplication, eq(assessmentSession.affiliateId, affiliateApplication.id))
    .leftJoin(affiliateBatch, eq(affiliateApplication.batchId, affiliateBatch.id))
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  const row = rows[0] || {};
  return {
    interviewQuestionIds: normalizeBatchQuestionIds(row.interviewQuestionIds),
    examQuestionIds: normalizeBatchQuestionIds(row.examQuestionIds),
  };
};

const getBatchTrainingContentForSession = async (sessionId) => {
  const rows = await db
    .select({
      batchId: affiliateBatch.id,
      trainingVideoUrl: affiliateBatch.trainingVideoUrl,
      trainingPdfUrl: affiliateBatch.trainingPdfUrl,
    })
    .from(assessmentSession)
    .leftJoin(affiliateApplication, eq(assessmentSession.affiliateId, affiliateApplication.id))
    .leftJoin(affiliateBatch, eq(affiliateApplication.batchId, affiliateBatch.id))
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  const row = rows[0] || {};
  let assignedMaterials = [];

  if (row.batchId) {
    const metas = await findMetasByTarget(row.batchId, RECRUITMENT_BATCH_META_TYPE);
    const trainingMeta = metas.find(
      (item) => item.key === BATCH_TRAINING_MATERIAL_IDS_META_KEY,
    );

    const trainingMaterialIds = (() => {
      try {
        const parsed = JSON.parse(trainingMeta?.content || '[]');
        return Array.isArray(parsed)
          ? [...new Set(parsed.map((item) => String(item || '').trim()).filter(Boolean))]
          : [];
      } catch {
        return [];
      }
    })();

    if (trainingMaterialIds.length > 0) {
      assignedMaterials = await db
        .select()
        .from(trainingContent)
        .where(
          and(
            eq(trainingContent.isActive, true),
            inArray(trainingContent.id, trainingMaterialIds),
          ),
        )
        .orderBy(asc(trainingContent.orderIndex));
    }
  }

  return {
    assignedMaterials,
    trainingVideoUrl: String(row.trainingVideoUrl || "").trim(),
    trainingPdfUrl: normalizePdfUrl(String(row.trainingPdfUrl || "").trim()),
  };
};

const normalizePdfUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/uploads/')) {
    const apiOrigin = (process.env.API_PUBLIC_URL || 'http://localhost:3005').replace(/\/api\/v1$/, '').replace(/\/$/, '');
    return `${apiOrigin}${value}`;
  }
  return value;
};

const parseWidgetEntries = (rawValue, prefix = 'embed-widget') => {
  if (!rawValue) return [];

  return rawValue
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry, index) => ({
      id: `${prefix}-${index + 1}`,
      label: `Widget ${index + 1}`,
      type: 'widget',
      widgetId: entry,
      script: `<script src="https://widgets.leadconnectorhq.com/loader.js" data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js" data-widget-id="${entry}"></script>`,
    }));
};

const parseEmbeddedCodeEntries = (rawValue) => {
  const normalizedValue = String(rawValue || '').trim();
  if (!normalizedValue) return [];

  return [
    {
      id: 'embed-script-1',
      label: 'Embedded Code',
      type: 'script',
      script: normalizedValue,
    },
  ];
};

const getScreeningPassingScore = async () => {
  const settings = await getAssessmentSettings();
  return Number(settings?.screeningPassingScore || 80);
};

const getExamPassingScoreForAffiliate = async (affiliateId) => {
  const [affiliate] = await db
    .select({
      batchExamPassingScore: affiliateBatch.examPassingScore,
    })
    .from(affiliateApplication)
    .leftJoin(affiliateBatch, eq(affiliateApplication.batchId, affiliateBatch.id))
    .where(eq(affiliateApplication.id, affiliateId))
    .limit(1);

  return Number(affiliate?.batchExamPassingScore || 70);
};

const getBatchPassingScoreMap = async (batchIds = [], fallbackPassingScore = 80) => {
  const uniqueBatchIds = [...new Set(batchIds.filter(Boolean))];
  if (uniqueBatchIds.length === 0) return new Map();

  const batches = await db
    .select({
      id: affiliateBatch.id,
      examPassingScore: affiliateBatch.examPassingScore,
    })
    .from(affiliateBatch)
    .where(inArray(affiliateBatch.id, uniqueBatchIds));

  return new Map(
    batches.map((batch) => [
      batch.id,
      Number(batch.examPassingScore || fallbackPassingScore),
    ]),
  );
};

const buildScreeningNotes = (score, passingScore, qualified) =>
  [
    `AI Screening Score: ${score.percentage}%`,
    `Passing Threshold: ${passingScore}%`,
    score.batchDecisionLabel ? `Batch Decision: ${score.batchDecisionLabel}` : null,
    score.batchDecisionAiLabel && score.batchDecisionAiLabel !== score.batchDecisionLabel
      ? `AI Batch Decision: ${score.batchDecisionAiLabel}`
      : null,
    `Recommendation: ${score.recommendation || (qualified ? 'qualified_candidate' : 'not_recommended')}`,
    `Summary: ${score.summary || (qualified ? 'Qualified for the next stage.' : 'Below the required threshold.')}`,
    score.batchDecisionReason ? `Batch Decision Reason: ${score.batchDecisionReason}` : null,
    score.whyChooseAssessment ? `Why Choose Assessment: ${score.whyChooseAssessment}` : null,
    score.decisionRationale ? `Decision Rationale: ${score.decisionRationale}` : null,
  ]
    .filter(Boolean)
    .join('\n');

const safeJsonParse = (value, fallback) => {
  if (!value) return fallback;
  if (typeof value !== 'string') return value ?? fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeScreeningList = (value) => {
  const parsed = safeJsonParse(value, []);
  return Array.isArray(parsed) ? parsed : [];
};

const buildBatchApplicantPayload = (applicant, passingScore) => {
  const analysisJson = safeJsonParse(applicant.screeningAnalysisJson, {});
  const factorScores = analysisJson?.factorScores || analysisJson?.breakdown || {};

  return {
    affiliateId: applicant.id,
    fullName: applicant.fullName,
    email: applicant.email,
    currentOccupation: applicant.occupation || '',
    salesExperience: applicant.salesExperience || '',
    hasSoldSaaS: applicant.hasSoldSaaS || '',
    salesStyle: applicant.salesStyle || '',
    incomeGoal: applicant.incomeGoal || '',
    whyChoose: applicant.whyChoose || '',
    overallScore: Number(applicant.screeningScore || 0),
    factorScores,
    recommendation: applicant.screeningRecommendation || '',
    summary: applicant.screeningSummary || '',
    strengths: normalizeScreeningList(applicant.screeningStrengths),
    weaknesses: normalizeScreeningList(applicant.screeningWeaknesses),
    decisionRationale: analysisJson?.decisionRationale || '',
    whyChooseAssessment: analysisJson?.whyChooseAssessment || '',
    configuredPassingScore: passingScore,
    status: applicant.status,
  };
};

const getPrecomputedBatchAnalysis = (analysisByBatchId, batchId) => {
  if (!analysisByBatchId) return null;
  if (analysisByBatchId instanceof Map) return analysisByBatchId.get(batchId) || null;
  return analysisByBatchId[batchId] || null;
};

const analysisCoversCandidates = (analysis, candidates) => {
  const decisions = Array.isArray(analysis?.candidateDecisions) ? analysis.candidateDecisions : [];
  if (!decisions.length || decisions.length < candidates.length) return false;

  const decisionIds = new Set(
    decisions
      .map((item) => String(item?.affiliateId || '').trim())
      .filter(Boolean),
  );

  return candidates.every((candidate) => decisionIds.has(candidate.affiliateId));
};

const persistBatchScreeningSummaries = async ({
  batchIds = [],
  trigger = 'manual',
  defaultPassingScore = 80,
  analysisByBatchId = null,
}) => {
  const uniqueBatchIds = [...new Set(batchIds.filter(Boolean))];
  if (!uniqueBatchIds.length) return [];

  const batchPassingScoreMap = await getBatchPassingScoreMap(uniqueBatchIds, defaultPassingScore);
  const summaries = [];

  for (const batchId of uniqueBatchIds) {
    const applicants = await db
      .select()
      .from(affiliateApplication)
      .where(eq(affiliateApplication.batchId, batchId))
      .orderBy(desc(affiliateApplication.createdAt));

    if (!applicants.length) continue;

    const passingScore = Number(batchPassingScoreMap.get(batchId) || defaultPassingScore);
    const candidates = applicants.map((applicant) => buildBatchApplicantPayload(applicant, passingScore));
    const precomputedAnalysis = getPrecomputedBatchAnalysis(analysisByBatchId, batchId);
    let batchAnalysis = analysisCoversCandidates(precomputedAnalysis, candidates)
      ? precomputedAnalysis
      : null;

    if (!batchAnalysis) {
      const { analyzeBatchScreeningWithAI } = await import('./ai-screening.service.js');
      batchAnalysis = await analyzeBatchScreeningWithAI(candidates, passingScore);
    }

    const decisionMap = new Map(
      (batchAnalysis?.candidateDecisions || []).map((item) => [item.affiliateId, item])
    );
    const rankedCandidates = [...candidates]
      .sort((a, b) => Number(b.overallScore || 0) - Number(a.overallScore || 0))
      .map((candidate, index) => {
        const decision = decisionMap.get(candidate.affiliateId);
        return {
          affiliateId: candidate.affiliateId,
          fullName: candidate.fullName,
          email: candidate.email,
          rank: index + 1,
          score: Number(candidate.overallScore || 0),
          passingThreshold: candidate.configuredPassingScore,
          status: candidate.status,
          label:
            decision?.label ||
            (Number(candidate.overallScore || 0) >= Number(candidate.configuredPassingScore || 0)
              ? 'Qualified'
              : 'Unqualified'),
          reason: decision?.reason || null,
        };
      });

    const summary = {
      batchId,
      summary: batchAnalysis?.summary || null,
      decisionRationale: batchAnalysis?.decisionRationale || null,
      topSignals: batchAnalysis?.topSignals || [],
      riskSignals: batchAnalysis?.riskSignals || [],
      rankedCandidates,
      trigger,
    };

    await updateBatchAiScreeningSummary(batchId, summary);
    summaries.push(summary);
  }

  return summaries;
};

const alignScreeningRecommendationToThreshold = (score, passingScore) => {
  const qualified = Number(score?.percentage || 0) >= Number(passingScore || 0);
  const current = String(score?.recommendation || '').trim();

  if (qualified) {
    return current || 'qualified_candidate';
  }

  if (current === 'strong_candidate' || current === 'qualified_candidate') {
    return Number(score?.percentage || 0) >= Math.max(Number(passingScore || 0) - 10, 0)
      ? 'borderline_candidate'
      : 'not_recommended';
  }

  return current || 'not_recommended';
};

const buildInterviewUrl = (examToken) =>
  `${AI_TRAINING_BASE_URL}/interview/${examToken}`;

const buildTrainingUrl = (examToken) =>
  `${AI_TRAINING_BASE_URL}/training/${examToken}`;

const buildExamProcessingResult = ({
  sessionData,
  examAttemptCount,
  maxExamAttempts,
  maxScore,
}) => ({
  status: 'submitted',
  processing: true,
  message: 'Your assessment has been submitted and AI is reviewing it now.',
  totalScore: null,
  maxScore,
  percentage: null,
  isPassed: null,
  passingPercentage: sessionData.passingPercentage,
  examAttemptCount,
  maxExamAttempts,
  remainingAttempts: Math.max(maxExamAttempts - examAttemptCount, 0),
  canRetry: false,
  disqualified: false,
});

const loadAffiliateSummaryForSession = async (affiliateId) => {
  if (!affiliateId) return null;

  const [affiliate] = await db
    .select({
      id: affiliateApplication.id,
      fullName: affiliateApplication.fullName,
      email: affiliateApplication.email,
      status: affiliateApplication.status,
    })
    .from(affiliateApplication)
    .where(eq(affiliateApplication.id, affiliateId))
    .limit(1);

  return affiliate || null;
};

const queueExamFinalization = async ({
  sessionId,
  sessionData,
  affiliate,
  maxScore,
  trigger = 'submit',
  isRecovery = false,
}) => {
  const queuedAt = new Date();

  await db
    .update(assessmentSession)
    .set({
      aiReviewRuntimeStatus: 'queued',
      aiReviewQueuedAt: queuedAt,
      aiReviewStartedAt: null,
      aiReviewFailedAt: null,
      aiReviewLastError: null,
      aiReviewRetryCount: isRecovery
        ? sql`coalesce(ai_review_retry_count, 0) + 1`
        : sql`coalesce(ai_review_retry_count, 0)`,
      updatedAt: queuedAt,
    })
    .where(eq(assessmentSession.id, sessionId));

  return queueBackgroundTask(
    'exam-submit-post-processing',
    async () => {
      await finalizeSubmittedExam({
        sessionId,
        sessionData,
        affiliate,
        maxScore,
      });
    },
    {
      sessionId,
      affiliateId: sessionData.affiliateId,
      status: 'submitted',
      trigger,
      recovery: isRecovery,
      lifecycle: {
        onStarted: async ({ startedAt }) => {
          await db
            .update(assessmentSession)
            .set({
              aiReviewRuntimeStatus: 'running',
              aiReviewStartedAt: startedAt ? new Date(startedAt) : new Date(),
              aiReviewFailedAt: null,
              aiReviewLastError: null,
              updatedAt: new Date(),
            })
            .where(eq(assessmentSession.id, sessionId));
        },
        onCompleted: async ({ completedAt }) => {
          await db
            .update(assessmentSession)
            .set({
              aiReviewRuntimeStatus: 'completed',
              aiReviewFailedAt: null,
              aiReviewLastError: null,
              updatedAt: completedAt ? new Date(completedAt) : new Date(),
            })
            .where(eq(assessmentSession.id, sessionId));
        },
        onFailed: async ({ failedAt, error }) => {
          await db
            .update(assessmentSession)
            .set({
              aiReviewRuntimeStatus: 'failed',
              aiReviewFailedAt: failedAt ? new Date(failedAt) : new Date(),
              aiReviewLastError: error?.message || 'Unknown exam review processing error',
              updatedAt: new Date(),
            })
            .where(eq(assessmentSession.id, sessionId));

          publishExamResult(sessionId, {
            type: 'exam_result_error',
            message: 'We could not finish reviewing your assessment yet. We will retry automatically if you reopen this page later.',
          });
        },
      },
    },
  );
};

const queueExamFinalizationRecoveryIfStale = async (sessionRow) => {
  if (!sessionRow || String(sessionRow.status) !== 'submitted' || sessionRow.scoredAt) {
    return false;
  }

  const submittedAtMs = sessionRow.submittedAt ? new Date(sessionRow.submittedAt).getTime() : 0;
  if (!submittedAtMs || (Date.now() - submittedAtMs) < EXAM_RESULT_RECOVERY_STALE_MS) {
    return false;
  }

  const runtimeStatus = String(sessionRow.aiReviewRuntimeStatus || 'idle');
  if (runtimeStatus === 'queued' || runtimeStatus === 'running') {
    return false;
  }

  const retryCount = Number(sessionRow.aiReviewRetryCount || 0);
  if (retryCount >= MAX_EXAM_RESULT_RECOVERY_ATTEMPTS) {
    return false;
  }

  const lastQueueAtMs = sessionRow.aiReviewQueuedAt ? new Date(sessionRow.aiReviewQueuedAt).getTime() : 0;
  if (lastQueueAtMs && (Date.now() - lastQueueAtMs) < EXAM_RESULT_RECOVERY_COOLDOWN_MS) {
    return false;
  }

  const affiliate = await loadAffiliateSummaryForSession(sessionRow.affiliateId);
  await queueExamFinalization({
    sessionId: sessionRow.id,
    sessionData: sessionRow,
    affiliate,
    maxScore: Number(sessionRow.maxScore || 0),
    trigger: 'stale_refresh_recovery',
    isRecovery: true,
  });

  logger.warn({
    sessionId: sessionRow.id,
    affiliateId: sessionRow.affiliateId,
    retryCount: retryCount + 1,
  }, `Queued stale exam review recovery for session ${sessionRow.id}`);

  return true;
};

const finalizeSubmittedExam = async ({
  sessionId,
  sessionData,
  affiliate,
  maxScore,
}) => {
  const processingStartedAt = Date.now();
  const answers = await getSavedAnswers(sessionId);
  const essayAnswersToScore = answers
    .filter(
      (answer) =>
        answer.questionType === 'essay' &&
        answer.essayAnswer &&
        (answer.score == null || Number(answer.score) === 0)
    )
    .map((answer) => ({
      questionId: answer.questionId,
      question: answer.question,
      essayAnswer: answer.essayAnswer,
      maxScore: Number(answer.questionPoints || answer.maxScore || 0),
    }));

  if (essayAnswersToScore.length > 0) {
    const essayScoringStartedAt = Date.now();
    const { autoScoreEssayAnswers } = await import('./ai-assessment-evaluation.service.js');
    const scoredEssayAnswers = await autoScoreEssayAnswers(essayAnswersToScore);

    await Promise.all(
      scoredEssayAnswers.map((essayScore) =>
        db
          .update(assessmentAnswer)
          .set({
            score: Number(essayScore.score || 0),
            reviewerFeedback: essayScore.feedback || null,
            updatedAt: new Date(),
          })
          .where(and(
            eq(assessmentAnswer.sessionId, sessionId),
            eq(assessmentAnswer.questionId, essayScore.questionId)
          ))
      )
    );

    logger.info(
      `Essay auto-scoring completed for session ${sessionId} in ${Date.now() - essayScoringStartedAt}ms`
    );
  }

  const latestAnswers = await getSavedAnswers(sessionId);
  const totalScore = latestAnswers.reduce(
    (sum, answer) => sum + Number(answer.score || 0),
    0,
  );
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  const examAttemptCount = Number(sessionData.examAttemptCount || 0);
  const maxExamAttempts = Number(sessionData.maxExamAttempts || DEFAULT_MAX_EXAM_ATTEMPTS);
  const isPassed = percentage >= Number(sessionData.passingPercentage || 0);
  const isFinalFailure = !isPassed && examAttemptCount >= maxExamAttempts;
  const remainingAttempts = Math.max(maxExamAttempts - examAttemptCount, 0);
  const finalStatus = isPassed ? 'passed' : 'failed';

  await db
    .update(assessmentSession)
    .set({
      status: finalStatus,
      totalScore,
      maxScore,
      percentage,
      isPassed,
      scoredAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(assessmentSession.id, sessionId));

  await addAuditLog(sessionId, 'exam_scored', {
    totalScore,
    maxScore,
    percentage,
    isPassed,
    examAttemptCount,
    maxExamAttempts,
  });

  const finalResult = await getExamResult(sessionId);
  publishExamResult(sessionId, {
    type: 'exam_result_ready',
    result: finalResult,
  });

  logger.info(
    `Exam result published for session ${sessionId} in ${Date.now() - processingStartedAt}ms`
  );

  const postResultTasks = [];

  postResultTasks.push((async () => {
    const aiReviewStartedAt = Date.now();
    try {
      const { evaluateExamPhaseWithAI, compileFinalAssessmentDecision } = await import('./ai-assessment-evaluation.service.js');
      const examAi = await evaluateExamPhaseWithAI(sessionId);
      const finalAi = await compileFinalAssessmentDecision(sessionData.affiliateId, examAi, {
        percentage,
        totalScore,
        maxScore,
        status: 'scored',
      });

      await db
        .update(assessmentSession)
        .set({
          aiExamRecommendation: examAi.recommendation || null,
          aiExamSummary: examAi.summary || null,
          aiExamStrengths: JSON.stringify(examAi.strengths || []),
          aiExamWeaknesses: JSON.stringify(examAi.weaknesses || []),
          aiExamDecisionRationale: examAi.decisionRationale || null,
          aiExamAnalysisJson: JSON.stringify({
            provider: examAi.provider,
            ...examAi.analysisJson,
          }),
          aiExamCompletedAt: new Date(),
          aiFinalRecommendation: finalAi.recommendation || null,
          aiFinalSummary: finalAi.summary || null,
          aiFinalStrengths: JSON.stringify(finalAi.strengths || []),
          aiFinalWeaknesses: JSON.stringify(finalAi.weaknesses || []),
          aiFinalDecisionRationale: finalAi.decisionRationale || null,
          aiFinalAnalysisJson: JSON.stringify({
            provider: finalAi.provider,
            ...finalAi.analysisJson,
          }),
          aiFinalCompletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(assessmentSession.id, sessionId));

      logger.info(
        `AI exam/final review completed for session ${sessionId} in ${Date.now() - aiReviewStartedAt}ms`
      );
    } catch (aiError) {
      logger.error({ err: aiError, sessionId }, `Failed to generate AI exam/final review for session ${sessionId}`);
    }
  })());

  if (affiliate?.id) {
    postResultTasks.push((async () => {
      const automationStartedAt = Date.now();
      if (isPassed) {
        try {
          const { approveAffiliate } = await import('../affiliate/affiliate.service.js');
          await approveAffiliate(affiliate.id, null, {
            source: 'automation',
            trigger: 'ai_exam_passed',
          });
          logger.info(
            `Auto-onboarding completed for affiliate ${affiliate.email} in ${Date.now() - automationStartedAt}ms`
          );
        } catch (automationError) {
          logger.error({ err: automationError, sessionId, affiliateId: affiliate.id, email: affiliate.email }, `Failed to auto-onboard affiliate ${affiliate.email}`);
        }
      } else if (isFinalFailure) {
        await db
          .update(affiliateApplication)
          .set({
            status: 'rejected',
            notes: `Candidate failed the certification exam after ${maxExamAttempts} attempts.`,
            reviewedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(affiliateApplication.id, affiliate.id));

        try {
          await sendExamFailedFinalEmail(affiliate, {
            percentage,
            passingPercentage: sessionData.passingPercentage,
            maxAttempts: maxExamAttempts,
          });
          logger.info(
            `Final failure handling completed for affiliate ${affiliate.email} in ${Date.now() - automationStartedAt}ms`
          );
        } catch (emailError) {
          logger.error({ err: emailError, sessionId, affiliateId: affiliate.id, email: affiliate.email }, `Failed to send exam failed email to ${affiliate.email}`);
        }
      }
    })());
  }

  await Promise.allSettled(postResultTasks);
};

export const queueBatchScreening = async ({ batchIds, source = 'manual' } = {}) => {
  const requestedBatchIds = [...new Set((Array.isArray(batchIds) ? batchIds : []).filter(Boolean))];

  if (!requestedBatchIds.length) {
    const queued = await queueBackgroundTask(
      'batch-screening',
      async () => {
        await processBatchScreening({ batchIds, source });
      },
      {
        batchIds: [],
        source,
      },
    );

    return {
      ...queued,
      acceptedBatchIds: [],
      skippedBatchIds: [],
    };
  }

  const existingBatches = await getBatchesByIds(requestedBatchIds);
  const queueableBatchIds = existingBatches
    .filter(
      (batch) =>
        batch.aiScreeningStatus !== 'queued' &&
        batch.aiScreeningStatus !== 'running',
    )
    .map((batch) => batch.id);
  const skippedBatchIds = existingBatches
    .filter(
      (batch) =>
        batch.aiScreeningStatus === 'queued' ||
        batch.aiScreeningStatus === 'running',
    )
    .map((batch) => batch.id);

  if (!queueableBatchIds.length) {
    return {
      status: 'already_running',
      taskId: null,
      queuedAt: new Date().toISOString(),
      acceptedBatchIds: [],
      skippedBatchIds,
    };
  }

  const queued = await queueBackgroundTask(
    'batch-screening',
    async () => {
      return await processBatchScreening({ batchIds: queueableBatchIds, source });
    },
    {
      batchIds: queueableBatchIds,
      source,
      lifecycle: {
        onQueued: async ({ taskId, queuedAt }) => {
          const queuedAtDate = queuedAt ? new Date(queuedAt) : new Date();
          await Promise.all(
            queueableBatchIds.map((batchId) =>
              updateBatchAiScreeningRuntimeState(batchId, {
                status: 'queued',
                taskId,
                queuedAt: queuedAtDate,
                startedAt: null,
                completedAt: null,
                failedAt: null,
                error: null,
              }),
            ),
          );
          await emitBackofficeBatchUpdates(queueableBatchIds);
        },
        onStarted: async ({ taskId, startedAt }) => {
          const startedAtDate = startedAt ? new Date(startedAt) : new Date();
          await Promise.all(
            queueableBatchIds.map((batchId) =>
              updateBatchAiScreeningRuntimeState(batchId, {
                status: 'running',
                taskId,
                startedAt: startedAtDate,
                failedAt: null,
                error: null,
              }),
            ),
          );
          await emitBackofficeBatchUpdates(queueableBatchIds);
        },
        onCompleted: async ({ completedAt }) => {
          const completedAtDate = completedAt ? new Date(completedAt) : new Date();
          await Promise.all(
            queueableBatchIds.map((batchId) =>
              updateBatchAiScreeningRuntimeState(batchId, {
                status: 'completed',
                completedAt: completedAtDate,
                failedAt: null,
                error: null,
              }),
            ),
          );
          await emitBackofficeBatchUpdates(queueableBatchIds);
        },
        onFailed: async ({ failedAt, error }) => {
          const failedAtDate = failedAt ? new Date(failedAt) : new Date();
          await Promise.all(
            queueableBatchIds.map((batchId) =>
              updateBatchAiScreeningRuntimeState(batchId, {
                status: 'failed',
                failedAt: failedAtDate,
                error: error?.message || 'Unknown AI screening error',
              }),
            ),
          );
          await emitBackofficeBatchUpdates(queueableBatchIds);
        },
      },
    },
  );

  return {
    ...queued,
    acceptedBatchIds: queueableBatchIds,
    skippedBatchIds,
  };
};

const sendExamInvitationForSession = async (affiliate, sessionData) => {
  if (!sessionData || !sessionData.id || !sessionData.examToken) return false;

  try {
    await sendExamInvitationEmail(affiliate, {
      examUrl: `${AI_TRAINING_BASE_URL}/exam/${sessionData.examToken}`,
      expiresAt: sessionData.examMustCompleteBy || sessionData.expiresAt || null,
    });

    await db
      .update(assessmentSession)
      .set({
        examInvitationSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, sessionData.id));

    return true;
  } catch (emailError) {
    logger.error(`Failed to send exam email to ${affiliate?.email || sessionData.affiliateId}:`, emailError);
    return false;
  }
};

const getAffiliateIdentity = async (affiliateId) => {
  const [affiliate] = await db
    .select({
      fullName: affiliateApplication.fullName,
      email: affiliateApplication.email,
    })
    .from(affiliateApplication)
    .where(eq(affiliateApplication.id, affiliateId))
    .limit(1);

  return (
    affiliate || {
      fullName: 'Candidate',
      email: '',
    }
  );
};

const buildSessionStatePayload = async (sessionData) => {
  const affiliate = sessionData?.affiliateId
    ? await getAffiliateIdentity(sessionData.affiliateId)
    : { fullName: 'Candidate', email: '' };
  const settings = await getAssessmentSettings();
  const trainingVideoCompletedIds = (() => {
    if (!sessionData.trainingVideoCompletedIds) return [];
    try {
      const parsed = JSON.parse(sessionData.trainingVideoCompletedIds);
      return Array.isArray(parsed)
        ? parsed.map((item) => String(item || '').trim()).filter(Boolean)
        : [];
    } catch {
      return [];
    }
  })();

  return {
    id: sessionData.id,
    affiliateId: sessionData.affiliateId,
    examToken: sessionData.examToken,
    token: sessionData.examToken,
    status: sessionData.status,
    startedAt: sessionData.startedAt,
    expiresAt: sessionData.expiresAt,
    createdAt: sessionData.createdAt,
    interviewStatus: sessionData.interviewStatus || 'not_started',
    interviewReviewedAt: sessionData.interviewReviewedAt || null,
    interviewReviewNotes: sessionData.interviewReviewNotes || null,
    interviewSubmittedLink: sessionData.interviewSubmittedLink || '',
    interviewSubmittedAt: sessionData.interviewSubmittedAt,
    interviewInvitationSentAt: sessionData.interviewInvitationSentAt,
    trainingInvitationSentAt: sessionData.trainingInvitationSentAt,
    examInvitationSentAt: sessionData.examInvitationSentAt,
    trainingStatus: sessionData.trainingStatus || 'not_started',
    trainingCompletedAt: sessionData.trainingCompletedAt,
    trainingEmbedViewed: Boolean(sessionData.trainingEmbedViewed),
    trainingVideoCompleted: Boolean(sessionData.trainingVideoCompleted),
    trainingVideoCompletedIds,
    trainingPdfPagesViewed: sessionData.trainingPdfPagesViewed,
    trainingCredentialsViewed: Boolean(sessionData.trainingCredentialsViewed),
    trainingAgreementAccepted: Boolean(sessionData.trainingAgreementAccepted),
    examMustCompleteBy: sessionData.examMustCompleteBy,
    examAttemptCount: Number(sessionData.examAttemptCount || 0),
    maxExamAttempts: Number(
      sessionData.maxExamAttempts || settings?.maxExamAttempts || DEFAULT_MAX_EXAM_ATTEMPTS
    ),
    examDurationMinutes: settings?.examDurationMinutes || 60,
    affiliate,
  };
};

// Generate answer hash for integrity verification
const generateAnswerHash = (answers) => {
  const sorted = JSON.stringify(answers.sort((a, b) => a.questionId.localeCompare(b.questionId)));
  return crypto.createHash('sha256').update(sorted).digest('hex');
};

const stableShuffleBySession = (items, sessionId, groupLabel) => {
  return [...items].sort((a, b) => {
    const hashA = crypto
      .createHash('sha256')
      .update(`${sessionId}:${groupLabel}:${a.id}`)
      .digest('hex');
    const hashB = crypto
      .createHash('sha256')
      .update(`${sessionId}:${groupLabel}:${b.id}`)
      .digest('hex');

    return hashA.localeCompare(hashB);
  });
};

// Add audit log entry
const addAuditLog = async (sessionId, eventType, eventData, ipAddress = null, userAgent = null) => {
  try {
    await db.insert(assessmentAuditLog).values({
      sessionId,
      eventType,
      eventData: eventData ? JSON.stringify(eventData) : null,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });
  } catch (e) {
    logger.error('Failed to add audit log:', e);
  }
};

export const createExamSession = async (affiliateId) => {
  const examToken = uuidv4();
  const expiresAt = new Date(Date.now() + EXAM_EXPIRY_HOURS * 60 * 60 * 1000);
  const passingPercentage = await getExamPassingScoreForAffiliate(affiliateId);

  const [session] = await db
    .insert(assessmentSession)
    .values({
      affiliateId,
      examToken,
      expiresAt,
      status: 'not_started',
      passingPercentage,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .$returningId();

  return {
    id: session,
    affiliateId,
    examToken,
    token: examToken,
    status: 'not_started',
    expiresAt,
    passingPercentage,
    createdAt: new Date(),
  };
};

export const createOrRefreshOnboardingSession = async (affiliateId) => {
  const [existing] = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.affiliateId, affiliateId))
    .orderBy(desc(assessmentSession.createdAt))
    .limit(1);

  if (existing) {
    const nextToken = existing.examToken || uuidv4();
    const nextExpiresAt =
      existing.expiresAt && new Date(existing.expiresAt) > new Date()
        ? existing.expiresAt
        : new Date(Date.now() + EXAM_EXPIRY_HOURS * 60 * 60 * 1000);
    const nextPassingPercentage =
      String(existing.status) === 'not_started'
        ? await getExamPassingScoreForAffiliate(affiliateId)
        : existing.passingPercentage;

    await db
      .update(assessmentSession)
      .set({
        examToken: nextToken,
        expiresAt: nextExpiresAt,
        passingPercentage: nextPassingPercentage,
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, existing.id));

    return {
      ...existing,
      examToken: nextToken,
      token: nextToken,
      expiresAt: nextExpiresAt,
      passingPercentage: nextPassingPercentage,
    };
  }

  return createExamSession(affiliateId);
};

export const validateExamToken = async (token, ipAddress = null, userAgent = null) => {
  // Simple query first
  const session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.examToken, token))
    .limit(1);

  if (!session || !session[0]) {
    throw new Error('Invalid exam token');
  }

  const data = session[0];

  const buildSessionPayload = () => buildSessionStatePayload(data);

  // If the exam was already submitted, still allow the user to reopen the link
  // to see the completion state instead of showing a scary invalid-link error.
  if (data.tokenInvalidated && ['submitted', 'scored', 'passed', 'failed', 'completed'].includes(String(data.status))) {
    return await buildSessionPayload();
  }

  // Check if token was invalidated after previous submission
  if (data.tokenInvalidated) {
    throw new Error('This exam link has already been used and is no longer valid');
  }

  // Check if expired
  if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
    throw new Error('Exam link has expired');
  }

  // We no longer auto-start the exam here. It must be explicitly started via startExam endpoint.

  return await buildSessionPayload();
};

export const getExamQuestions = async (sessionId) => {
  const { examQuestionIds } = await getBatchQuestionSetForSession(sessionId);
  if (examQuestionIds.length === 0) {
    return [];
  }

  const [session] = await db
    .select({ examAttemptCount: assessmentSession.examAttemptCount })
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);
  const attemptSeed = Number(session?.examAttemptCount || 1);

  // Get active exam questions (multiple choice and essay only, not video interview)
  // Note: We do NOT select correctAnswer to prevent exposing it to client
  const conditions = [
    eq(assessmentQuestion.isActive, true),
    or(
      eq(assessmentQuestion.questionType, 'multiple_choice'),
      eq(assessmentQuestion.questionType, 'essay')
    ),
    inArray(assessmentQuestion.id, examQuestionIds),
  ];

  const questions = await db
    .select({
      id: assessmentQuestion.id,
      type: assessmentQuestion.questionType,
      question: assessmentQuestion.question,
      options: assessmentQuestion.options,
      points: assessmentQuestion.points,
      isRequired: assessmentQuestion.isRequired,
      orderIndex: assessmentQuestion.orderIndex,
    })
    .from(assessmentQuestion)
    .where(and(...conditions))
    .orderBy(assessmentQuestion.orderIndex);

  // Parse options JSON for multiple choice
  const parsedQuestions = questions.map(q => {
    let options = null;
    if (q.options) {
      try {
        let optStr = q.options;
        // Handle escaped JSON (double-encoded)
        if (typeof optStr === 'string') {
          // Try to unescape the string
          try {
            optStr = JSON.parse(optStr);
          } catch {
            // If that fails, try unescaping manually
            optStr = optStr.replace(/\\"/g, '"').replace(/^"|"$/g, '');
          }
        }
        options = typeof optStr === 'string' ? JSON.parse(optStr) : optStr;
      } catch (e) {
        console.error('Failed to parse options:', e, q.options);
        options = null;
      }
    }
    
    return {
      id: q.id,
      type: q.type,
      question: q.question,
      options,
      points: q.points,
      isRequired: q.isRequired,
      orderIndex: q.orderIndex,
    };
  });

  const multipleChoiceQuestions = stableShuffleBySession(
    parsedQuestions.filter((question) => question.type === 'multiple_choice'),
    `${sessionId}:${attemptSeed}`,
    'multiple_choice'
  );
  const essayQuestions = stableShuffleBySession(
    parsedQuestions.filter((question) => question.type === 'essay'),
    `${sessionId}:${attemptSeed}`,
    'essay'
  );

  return [...multipleChoiceQuestions, ...essayQuestions].map((question, index) => ({
    ...question,
    orderIndex: index + 1,
  }));
};

export const getPublicVideoInstructions = async () => {
  // Fetch only active video_introduction questions for public registration forms
  const questions = await db
    .select({
      id: assessmentQuestion.id,
      type: assessmentQuestion.questionType,
      question: assessmentQuestion.question,
      videoInstructions: assessmentQuestion.videoInstructions,
      orderIndex: assessmentQuestion.orderIndex,
    })
    .from(assessmentQuestion)
    .where(
      and(
        eq(assessmentQuestion.isActive, true),
        eq(assessmentQuestion.questionType, 'video_introduction')
      )
    )
    .orderBy(assessmentQuestion.orderIndex);

  return questions;
};

export const saveAnswers = async (sessionId, answers) => {
  // Get session
  const session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  if (!session || !session[0]) {
    throw new Error('Session not found');
  }

  const sessionData = session[0];
  
  // Server-side training completion verification
  if (sessionData.trainingStatus !== 'completed') {
    throw new Error('Training must be completed before answering questions');
  }

  const currentStatus = String(sessionData.status);
  if (currentStatus === 'completed' || currentStatus === 'scored') {
    throw new Error('Exam already submitted');
  }

  // Update session status to in_progress if not started
  if (currentStatus === 'not_started' || currentStatus === 'pending') {
    await db
      .update(assessmentSession)
      .set({ status: 'in_progress', updatedAt: new Date() })
      .where(eq(assessmentSession.id, sessionId));
  }

  const { examQuestionIds } = await getBatchQuestionSetForSession(sessionId);
  if (examQuestionIds.length === 0) {
    throw new Error('No exam questions are configured for this batch yet');
  }

  // Get questions to determine types
  const questionConditions = [
    eq(assessmentQuestion.isActive, true),
    or(
      eq(assessmentQuestion.questionType, 'multiple_choice'),
      eq(assessmentQuestion.questionType, 'essay')
    ),
    inArray(assessmentQuestion.id, examQuestionIds),
  ];

  const questions = await db
    .select()
    .from(assessmentQuestion)
    .where(and(...questionConditions));

  const existingExamQuestionIds = questions.map((question) => question.id);
  if (existingExamQuestionIds.length > 0) {
    await db
      .delete(assessmentAnswer)
      .where(
        and(
          eq(assessmentAnswer.sessionId, sessionId),
          inArray(assessmentAnswer.questionId, existingExamQuestionIds)
        )
      );
  }

  // Insert new answers
  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId);
    const answerType = question?.questionType || 'multiple_choice';
    
    await db
      .insert(assessmentAnswer)
      .values({
        sessionId,
        questionId: answer.questionId,
        answerType,
        selectedOption: answer.selectedOption || null,
        essayAnswer: answer.essayAnswer || null,
        videoUrl: answer.videoUrl || null,
        maxScore: question?.points || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  }

  return { status: 'saved' };
};

export const getSavedAnswers = async (sessionId) => {
  const answers = await db
    .select({
      ...assessmentAnswer,
    })
    .from(assessmentAnswer)
    .where(eq(assessmentAnswer.sessionId, sessionId));

  // Get question info
  const questions = await db
    .select({
      id: assessmentQuestion.id,
      type: assessmentQuestion.questionType,
      question: assessmentQuestion.question,
      options: assessmentQuestion.options,
      points: assessmentQuestion.points,
      correctAnswer: assessmentQuestion.correctAnswer,
    })
    .from(assessmentQuestion);

  return answers.map(a => {
    const question = questions.find(q => q.id === a.questionId);
    return {
      id: a.id,
      questionId: a.questionId,
      questionType: question?.type || a.questionType,
      question: question?.question,
      questionOptions: question?.options,
      correctAnswer: question?.correctAnswer,
      questionPoints: question?.points,
      selectedOption: a.selectedOption,
      essayAnswer: a.essayAnswer,
      videoUrl: a.videoUrl,
      score: a.score,
      isCorrect: a.isCorrect,
    };
  });
};

export const submitExam = async (sessionId, answers, ipAddress = null, userAgent = null, securityData = {}) => {
  console.log('submitExam called with sessionId:', sessionId, 'answers:', JSON.stringify(answers));
  
  const { fingerprint, tabSwitchCount, isFullscreen } = securityData;
  const normalizedSubmitIp = normalizeIp(ipAddress);
  
  // Get session
  const session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  console.log('Session query result:', session);

  if (!session || !session[0]) {
    throw new Error('Session not found');
  }

  const sessionData = session[0];
  
  const currentStatus = String(sessionData.status);
  if (currentStatus === 'completed' || currentStatus === 'scored') {
    throw new Error('Exam already submitted');
  }

  // Check if token was invalidated
  if (sessionData.tokenInvalidated) {
    throw new Error('This exam has already been submitted');
  }

  const securityFlags = [];
  let submittedLate = false;

  // Check if exam duration exceeded (with 5 min grace period for network latency)
  if (sessionData.expiresAt) {
    const hardLimit = new Date(new Date(sessionData.expiresAt).getTime() + 5 * 60 * 1000);
    if (new Date() > hardLimit) {
      // Still process it, but add a security flag
      securityFlags.push('submitted_late');
      submittedLate = true;
      logger.warn(`Exam submitted after hard limit for session ${sessionId}`);
    }
  }

  const { examQuestionIds } = await getBatchQuestionSetForSession(sessionId);
  if (examQuestionIds.length === 0) {
    throw new Error('No exam questions are configured for this batch yet');
  }

  // Get questions for scoring (including correctAnswer for server-side grading)
  const questionConditions = [
    eq(assessmentQuestion.isActive, true),
    or(
      eq(assessmentQuestion.questionType, 'multiple_choice'),
      eq(assessmentQuestion.questionType, 'essay')
    ),
    inArray(assessmentQuestion.id, examQuestionIds),
  ];

  const questions = await db
    .select()
    .from(assessmentQuestion)
    .where(and(...questionConditions));
  
  console.log('Questions found:', questions.length);

  // Calculate duration
  let totalDurationSeconds = 0;
  if (sessionData.startedAt) {
    totalDurationSeconds = Math.floor((new Date() - new Date(sessionData.startedAt)) / 1000);
  }

  // Generate answer hash for integrity verification
  const answerHash = generateAnswerHash(answers);
  console.log('Answer hash:', answerHash);

  // Calculate score
  let totalScore = 0;
  const maxScore = questions.reduce(
    (sum, question) => sum + Number(question.points || 0),
    0,
  );

  // Insert answers and calculate score
  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    try {
      await db
        .insert(assessmentAnswer)
        .values({
          sessionId,
          questionId: answer.questionId,
          answerType: question.questionType,
          selectedOption: answer.selectedOption || null,
          essayAnswer: answer.essayAnswer || null,
          videoUrl: answer.videoUrl || null,
          maxScore: question.points,
          answeredAt: new Date(),
        })
        .onDuplicateKeyUpdate({
          selectedOption: answer.selectedOption || null,
          essayAnswer: answer.essayAnswer || null,
          videoUrl: answer.videoUrl || null,
          answeredAt: new Date(),
        });
    } catch (insertErr) {
      console.error('Insert error:', insertErr);
    }

    // Auto-score multiple choice - using SERVER-SIDE correctAnswer (NOT from client)
    if (question.questionType === 'multiple_choice' && answer.selectedOption) {
      // Get correctAnswer from server (never sent to client)
      const correctAnswer = question.correctAnswer;
      const isCorrect = answer.selectedOption === correctAnswer;
      const score = isCorrect ? question.points : 0;
      totalScore += score;

      await db
        .update(assessmentAnswer)
        .set({
          score,
          isCorrect,
        })
        .where(and(
          eq(assessmentAnswer.sessionId, sessionId),
          eq(assessmentAnswer.questionId, answer.questionId)
        ));
    }
  }

  const examAttemptCount = Number(sessionData.examAttemptCount || 0);
  const maxExamAttempts = Number(sessionData.maxExamAttempts || DEFAULT_MAX_EXAM_ATTEMPTS);

  // Check for suspicious patterns
  if (totalDurationSeconds > 0 && answers.length > 0) {
    const avgTimePerQuestion = totalDurationSeconds / answers.length;
    if (avgTimePerQuestion < 5) {
      securityFlags.push('fast_submission'); // Less than 5 seconds per question
    }
    if (totalDurationSeconds > 7200) {
      securityFlags.push('extended_duration'); // More than 2 hours
    }
  }

  // Add flags for tab switches and non-fullscreen
  if (tabSwitchCount && tabSwitchCount > 0) {
    securityFlags.push(`tab_switch_count:${tabSwitchCount}`);
  }
  if (!isFullscreen) {
    securityFlags.push('not_fullscreen');
  }
  if (fingerprint) {
    console.log('Browser fingerprint:', fingerprint);
  }

  const securityAssessment = buildSecurityAssessment({
    startIpAddress: sessionData.ipAddress,
    submitIpAddress: normalizedSubmitIp,
    startUserAgent: sessionData.userAgent,
    submitUserAgent: userAgent,
    startFingerprint: sessionData.browserFingerprint,
    submitFingerprint: fingerprint || sessionData.browserFingerprint,
    tabSwitchCount: tabSwitchCount || 0,
    isFullscreen: isFullscreen !== false,
    submittedLate,
    fastSubmission: securityFlags.includes('fast_submission'),
    extendedDuration: securityFlags.includes('extended_duration'),
    answerIntegrityVerified: true,
  });

  const combinedSecurityFlags = Array.from(new Set([...securityFlags, ...securityAssessment.flags]));

  if (securityAssessment.analysis.ipChanged) {
    logger.warn(
      `Exam IP changed for session ${sessionId}: started at ${sessionData.ipAddress}, submitted from ${normalizedSubmitIp}`
    );
  }

  // Invalidate token after submission
  await db
    .update(assessmentSession)
    .set({
      status: 'submitted',
      totalScore,
      maxScore,
      percentage: 0,
      isPassed: null,
      submittedAt: new Date(),
      scoredAt: null,
      totalDurationSeconds,
      answerHash,
      answerIntegrityVerified: true,
      tokenInvalidated: true,
      submitIpAddress: normalizedSubmitIp,
      submitUserAgent: userAgent,
      browserFingerprint: fingerprint || sessionData.browserFingerprint,
      tabSwitchCount: tabSwitchCount || 0,
      securityFlags: combinedSecurityFlags.length > 0 ? JSON.stringify(combinedSecurityFlags) : null,
      securityRiskScore: securityAssessment.riskScore,
      securityRiskLevel: securityAssessment.riskLevel,
      securitySummary: securityAssessment.summary,
      securityAnalysisJson: JSON.stringify({
        reasons: securityAssessment.reasons,
        strengths: securityAssessment.strengths,
        ...securityAssessment.analysis,
      }),
      securityReviewRequired: securityAssessment.reviewRequired,
      updatedAt: new Date(),
    })
    .where(eq(assessmentSession.id, sessionId));

  const [affiliate] = await db
    .select({
      id: affiliateApplication.id,
      fullName: affiliateApplication.fullName,
      email: affiliateApplication.email,
      status: affiliateApplication.status,
    })
    .from(affiliateApplication)
    .where(eq(affiliateApplication.id, sessionData.affiliateId))
    .limit(1);

  // Add audit log for submission
  await addAuditLog(sessionId, 'exam_submit', { 
    provisionalScore: totalScore,
    maxScore,
    totalDurationSeconds,
    answerCount: answers.length,
    securityFlags: combinedSecurityFlags,
    securityRiskScore: securityAssessment.riskScore,
    securityRiskLevel: securityAssessment.riskLevel,
    securitySummary: securityAssessment.summary,
    fingerprint,
    tabSwitchCount,
    isFullscreen,
  }, ipAddress, userAgent);

  await queueExamFinalization({
    sessionId,
    sessionData,
    affiliate,
    maxScore,
    trigger: 'submit',
    isRecovery: false,
  });

  return {
    ...buildExamProcessingResult({
      sessionData,
      examAttemptCount,
      maxExamAttempts,
      maxScore,
    }),
    totalDurationSeconds,
    securityFlags: combinedSecurityFlags.length > 0 ? combinedSecurityFlags : null,
    securityRiskScore: securityAssessment.riskScore,
    securityRiskLevel: securityAssessment.riskLevel,
    securitySummary: securityAssessment.summary,
  };
};

export const processBatchScreening = async ({ batchIds, source = 'manual' } = {}) => {
  const result = {
    processed: 0,
    qualified: 0,
    notQualified: 0,
    interviewProcessed: 0,
    trainingReleased: 0,
    emailsSent: 0,
    passingThreshold: null,
    summary: null,
    decisionRationale: null,
    topSignals: [],
    riskSignals: [],
    rankedCandidates: [],
    batchSummaries: [],
  };

  try {
    const defaultPassingScore = await getScreeningPassingScore();
    // Get pending applicants who haven't been screened yet
    const screeningConditions = [eq(affiliateApplication.status, 'pending')];
    if (Array.isArray(batchIds) && batchIds.length > 0) {
      screeningConditions.push(inArray(affiliateApplication.batchId, batchIds));
    }

    const pendingApplicants = await db
      .select()
      .from(affiliateApplication)
      .where(and(...screeningConditions))
      .orderBy(desc(affiliateApplication.createdAt))
      .limit(Array.isArray(batchIds) && batchIds.length > 0 ? 1000 : BATCH_SIZE);

    if (pendingApplicants.length === 0) {
      logger.info('No pending applicants to process');
      if (Array.isArray(batchIds) && batchIds.length > 0) {
        result.batchSummaries = await persistBatchScreeningSummaries({
          batchIds,
          trigger: source,
          defaultPassingScore,
        });
        result.summary = result.batchSummaries[0]?.summary || null;
        result.decisionRationale = result.batchSummaries[0]?.decisionRationale || null;
        result.topSignals = result.batchSummaries[0]?.topSignals || [];
        result.riskSignals = result.batchSummaries[0]?.riskSignals || [];
        result.rankedCandidates = result.batchSummaries[0]?.rankedCandidates || [];
      }
      return result;
    }

    const batchPassingScoreMap = await getBatchPassingScoreMap(
      pendingApplicants.map((applicant) => applicant.batchId),
      defaultPassingScore,
    );
    const getApplicantPassingScore = (applicant) =>
      Number(batchPassingScoreMap.get(applicant.batchId) || defaultPassingScore);
    const configuredPassingScores = [
      ...new Set(pendingApplicants.map((applicant) => getApplicantPassingScore(applicant))),
    ];

    // Import AI screening service dynamically to avoid circular dependency
    const { analyzeApplicantWithAI, analyzeBatchScreeningWithAI, saveScreeningScore } = await import('./ai-screening.service.js');

    const scoredApplicants = [];

    for (const applicant of pendingApplicants) {
      try {
        const score = await analyzeApplicantWithAI(applicant.id);
        scoredApplicants.push({
          applicant,
          score,
        });
      } catch (processError) {
        console.error('Error processing applicant', applicant.id, processError);
        logger.error(`Error processing applicant ${applicant.id}:`, processError);
      }
    }

    if (scoredApplicants.length === 0) {
      logger.info('No applicants were successfully scored during batch screening');
      if (Array.isArray(batchIds) && batchIds.length > 0) {
        result.batchSummaries = await persistBatchScreeningSummaries({
          batchIds,
          trigger: source,
          defaultPassingScore,
        });
        result.summary = result.batchSummaries[0]?.summary || null;
        result.decisionRationale = result.batchSummaries[0]?.decisionRationale || null;
        result.topSignals = result.batchSummaries[0]?.topSignals || [];
        result.riskSignals = result.batchSummaries[0]?.riskSignals || [];
        result.rankedCandidates = result.batchSummaries[0]?.rankedCandidates || [];
      }
      return result;
    }

    const batchAnalysis = await analyzeBatchScreeningWithAI(
      scoredApplicants.map(({ applicant, score }) => ({
        affiliateId: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
        currentOccupation: applicant.occupation || '',
        salesExperience: applicant.salesExperience || '',
        hasSoldSaaS: applicant.hasSoldSaaS || '',
        salesStyle: applicant.salesStyle || '',
        incomeGoal: applicant.incomeGoal || '',
        whyChoose: applicant.whyChoose || '',
        overallScore: Number(score.percentage || 0),
        factorScores: score.breakdown || {},
        recommendation: score.recommendation || '',
        summary: score.summary || '',
        strengths: score.strengths || [],
        weaknesses: score.weaknesses || [],
        decisionRationale: score.decisionRationale || '',
        whyChooseAssessment: score.whyChooseAssessment || '',
        configuredPassingScore: getApplicantPassingScore(applicant),
      })),
      configuredPassingScores.length === 1 ? configuredPassingScores[0] : defaultPassingScore,
    );

    const decisionMap = new Map(
      (batchAnalysis?.candidateDecisions || []).map((item) => [item.affiliateId, item])
    );

    result.passingThreshold = configuredPassingScores.length === 1 ? configuredPassingScores[0] : null;
    result.summary = batchAnalysis?.summary || null;
    result.decisionRationale = batchAnalysis?.decisionRationale || null;
    result.topSignals = batchAnalysis?.topSignals || [];
    result.riskSignals = batchAnalysis?.riskSignals || [];

    const rankedApplicants = [...scoredApplicants].sort(
      (a, b) => Number(b.score?.percentage || 0) - Number(a.score?.percentage || 0)
    );

    result.rankedCandidates = rankedApplicants.map(({ applicant, score }, index) => {
      const batchDecision = decisionMap.get(applicant.id);
      const passingScore = getApplicantPassingScore(applicant);
      const qualified = Number(score?.percentage || 0) >= passingScore;
      return {
        affiliateId: applicant.id,
        fullName: applicant.fullName,
        email: applicant.email,
        rank: index + 1,
        score: Number(score?.percentage || 0),
        passingThreshold: passingScore,
        label: qualified ? 'Qualified' : 'Unqualified',
        aiLabel: batchDecision?.label || null,
      };
    });

    for (const { applicant, score } of rankedApplicants) {
      try {
        const batchDecision = decisionMap.get(applicant.id);
        const passingScore = getApplicantPassingScore(applicant);
        const qualified = Number(score?.percentage || 0) >= passingScore;
        const batchDecisionAiLabel = batchDecision?.label || null;
        const batchDecisionLabel = qualified ? 'Qualified' : 'Unqualified';
        const screeningRecommendation = alignScreeningRecommendationToThreshold(score, passingScore);
        const enrichedScore = {
          ...score,
          batchDecisionLabel,
          batchDecisionAiLabel,
          batchDecisionReason: batchDecision?.reason || null,
          batchPassingThreshold: passingScore,
          batchSummary: batchAnalysis?.summary || null,
          batchDecisionRationale: batchAnalysis?.decisionRationale || null,
          analysisJson: {
            ...(score.analysisJson || {}),
            batchDecisionLabel,
            batchDecisionAiLabel,
            batchDecisionReason: batchDecision?.reason || null,
            batchPassingThreshold: passingScore,
            batchSummary: batchAnalysis?.summary || null,
            batchDecisionRationale: batchAnalysis?.decisionRationale || null,
          },
        };

        result.processed++;

        if (qualified) {
          const examSession = await saveScreeningScore(applicant.id, {
            ...enrichedScore,
            recommendation: screeningRecommendation,
          });
          result.qualified++;

          await db
            .update(affiliateApplication)
            .set({
              status: 'qualified',
              notes: buildScreeningNotes(enrichedScore, passingScore, true),
              screeningScore: enrichedScore.percentage,
              screeningPassingScore: passingScore,
              screeningRecommendation,
              screeningSummary: enrichedScore.summary || null,
              screeningStrengths: JSON.stringify(enrichedScore.strengths || []),
              screeningWeaknesses: JSON.stringify(enrichedScore.weaknesses || []),
              screeningAnalysisJson: JSON.stringify(enrichedScore.analysisJson || {}),
              screeningCompletedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(affiliateApplication.id, applicant.id));

          if (!examSession.interviewInvitationSentAt) {
            try {
              await sendVideoInterviewInvitationEmail(applicant, {
                interviewUrl: buildInterviewUrl(examSession.examToken),
                expiresAt: examSession.expiresAt,
              });
              await db
                .update(assessmentSession)
                .set({
                  interviewInvitationSentAt: new Date(),
                  updatedAt: new Date(),
                })
                .where(eq(assessmentSession.id, examSession.id));
              result.emailsSent++;
            } catch (emailError) {
              logger.error(`Failed to send interview email to ${applicant.email}:`, emailError);
            }
          }

        } else {
          result.notQualified++;
          await db
            .update(affiliateApplication)
            .set({
              status: 'rejected',
              notes: buildScreeningNotes(enrichedScore, passingScore, false),
              screeningScore: enrichedScore.percentage,
              screeningPassingScore: passingScore,
              screeningRecommendation,
              screeningSummary: enrichedScore.summary || null,
              screeningStrengths: JSON.stringify(enrichedScore.strengths || []),
              screeningWeaknesses: JSON.stringify(enrichedScore.weaknesses || []),
              screeningAnalysisJson: JSON.stringify(enrichedScore.analysisJson || {}),
              screeningCompletedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(affiliateApplication.id, applicant.id));
        }
      } catch (processError) {
        console.error('Error processing applicant', applicant.id, processError);
        logger.error(`Error processing applicant ${applicant.id}:`, processError);
      }
    }

    const affectedBatchIds =
      Array.isArray(batchIds) && batchIds.length > 0
        ? batchIds
        : [...new Set(pendingApplicants.map((applicant) => applicant.batchId).filter(Boolean))];
    const reusableBatchAnalysis =
      affectedBatchIds.length === 1
        ? new Map([[affectedBatchIds[0], batchAnalysis]])
        : null;
    result.batchSummaries = await persistBatchScreeningSummaries({
      batchIds: affectedBatchIds,
      trigger: source,
      defaultPassingScore,
      analysisByBatchId: reusableBatchAnalysis,
    });
    if (result.batchSummaries.length === 1) {
      result.summary = result.batchSummaries[0].summary;
      result.decisionRationale = result.batchSummaries[0].decisionRationale;
      result.topSignals = result.batchSummaries[0].topSignals;
      result.riskSignals = result.batchSummaries[0].riskSignals;
      result.rankedCandidates = result.batchSummaries[0].rankedCandidates;
    }

    logger.info({ result }, 'Batch curation completed');
    return result;
  } catch (error) {
    logger.error({ err: error, batchIds, source }, 'Batch curation failed');
    throw error;
  }
};

export const processSingleScreening = async (affiliateId) => {
  try {
    const defaultPassingScore = await getScreeningPassingScore();
    const passingScore = await getExamPassingScoreForAffiliate(affiliateId) || defaultPassingScore;
    // Get the affiliate application
    const [application] = await db
      .select()
      .from(affiliateApplication)
      .where(eq(affiliateApplication.id, affiliateId))
      .limit(1);

    if (!application) {
      throw new Error('Application not found');
    }

    // Skip if already processed
    if (application.status !== 'pending') {
      return { status: application.status, message: 'Already processed' };
    }

    // Import AI screening service
    const { analyzeApplicantWithAI, saveScreeningScore } = await import('./ai-screening.service.js');

    // Analyze with AI
    const score = await analyzeApplicantWithAI(application.id);
    const qualified = score.percentage >= passingScore;
    const screeningRecommendation = alignScreeningRecommendationToThreshold(score, passingScore);

    if (qualified) {
      // Create or refresh training session only for qualified candidates
      const examSession = await saveScreeningScore(application.id, {
        ...score,
        recommendation: screeningRecommendation,
      });
      // Update status to qualified
      await db
        .update(affiliateApplication)
        .set({
          status: 'qualified',
          notes: buildScreeningNotes(score, passingScore, true),
          screeningScore: score.percentage,
          screeningPassingScore: passingScore,
          screeningRecommendation,
          screeningSummary: score.summary || null,
          screeningStrengths: JSON.stringify(score.strengths || []),
          screeningWeaknesses: JSON.stringify(score.weaknesses || []),
          screeningAnalysisJson: JSON.stringify(score.analysisJson || {}),
          screeningCompletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(affiliateApplication.id, affiliateId));
      
      if (!examSession.interviewInvitationSentAt) {
        try {
          await sendVideoInterviewInvitationEmail(application, {
            interviewUrl: buildInterviewUrl(examSession.examToken),
            expiresAt: examSession.expiresAt,
          });
          await db
            .update(assessmentSession)
            .set({
              interviewInvitationSentAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(assessmentSession.id, examSession.id));
        } catch (emailError) {
          logger.error(`Failed to send interview email to ${application.email}:`, emailError);
        }
      }

      return { status: 'qualified', score: score.percentage, message: 'Qualified - waiting for next eligible onboarding email trigger' };
    } else {
      // Update status to rejected
      await db
        .update(affiliateApplication)
        .set({
          status: 'rejected',
          notes: buildScreeningNotes(score, passingScore, false),
          screeningScore: score.percentage,
          screeningPassingScore: passingScore,
          screeningRecommendation,
          screeningSummary: score.summary || null,
          screeningStrengths: JSON.stringify(score.strengths || []),
          screeningWeaknesses: JSON.stringify(score.weaknesses || []),
          screeningAnalysisJson: JSON.stringify(score.analysisJson || {}),
          screeningCompletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(affiliateApplication.id, affiliateId));
      
      return { status: 'rejected', score: score.percentage, message: 'Not qualified' };
    }
  } catch (error) {
    logger.error('Single screening failed:', error);
    throw error;
  }
};

export const processEligibleBatchCurations = async () => {
  const eligibleBatches = await listBatchesEligibleForAutoCurate();

  if (!eligibleBatches.length) {
    return {
      processedBatches: 0,
      processedApplicants: 0,
      qualified: 0,
      notQualified: 0,
      emailsSent: 0,
    };
  }

  const aggregate = {
    processedBatches: eligibleBatches.length,
    processedApplicants: 0,
    qualified: 0,
    notQualified: 0,
    interviewProcessed: 0,
    trainingReleased: 0,
    emailsSent: 0,
  };

  for (const batch of eligibleBatches) {
    const batchResult = await processBatchScreening({
      batchIds: [batch.id],
      source: batch.registrationQuota > 0 ? 'auto_quota_or_expired' : 'auto_batch_expired',
    });
    aggregate.processedApplicants += batchResult.processed;
    aggregate.qualified += batchResult.qualified;
    aggregate.notQualified += batchResult.notQualified;
    aggregate.interviewProcessed += batchResult.interviewProcessed;
    aggregate.trainingReleased += batchResult.trainingReleased;
    aggregate.emailsSent += batchResult.emailsSent;
  }

  return aggregate;
};

export const getExamResult = async (sessionId) => {
  const session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  if (!session || !session[0]) {
    throw new Error('Session not found');
  }

  const sessionRow = session[0];
  const examAttemptCount = Number(sessionRow.examAttemptCount || 0);
  const maxExamAttempts = Number(sessionRow.maxExamAttempts || DEFAULT_MAX_EXAM_ATTEMPTS);
  const remainingAttempts = Math.max(maxExamAttempts - examAttemptCount, 0);

  if (String(sessionRow.status) === 'submitted' || !sessionRow.scoredAt) {
    await queueExamFinalizationRecoveryIfStale(sessionRow);
    return buildExamProcessingResult({
      sessionData: sessionRow,
      examAttemptCount,
      maxExamAttempts,
      maxScore: Number(sessionRow.maxScore || 0),
    });
  }

  const isPassed = Boolean(sessionRow.isPassed);
  const disqualified = !isPassed && examAttemptCount >= maxExamAttempts;

  return {
    status: sessionRow.status,
    processing: false,
    totalScore: sessionRow.totalScore || 0,
    maxScore: sessionRow.maxScore || 0,
    percentage: sessionRow.percentage || 0,
    isPassed,
    passingPercentage: sessionRow.passingPercentage,
    examAttemptCount,
    maxExamAttempts,
    remainingAttempts,
    canRetry: !isPassed && !disqualified,
    disqualified,
  };
};

export const retryExamFromTraining = async (sessionId) => {
  const [session] = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  if (!session) {
    throw new Error('Session not found');
  }

  const attemptCount = Number(session.examAttemptCount || 0);
  const maxAttempts = Number(session.maxExamAttempts || DEFAULT_MAX_EXAM_ATTEMPTS);

  if (attemptCount >= maxAttempts) {
    throw new Error('Maximum exam attempts reached for this application.');
  }

  if (String(session.status) !== 'failed') {
    throw new Error('Exam retry is only available after a failed attempt.');
  }

  await db.transaction(async (tx) => {
    await tx
      .delete(assessmentAnswer)
      .where(eq(assessmentAnswer.sessionId, sessionId));

    await tx
      .update(assessmentSession)
      .set({
        status: 'not_started',
        startedAt: null,
        submittedAt: null,
        scoredAt: null,
        totalDurationSeconds: null,
        totalScore: 0,
        maxScore: 0,
        percentage: 0,
        isPassed: null,
        tokenInvalidated: false,
        tokenUsedAt: null,
        answerHash: null,
        answerIntegrityVerified: false,
        securityFlags: null,
        securityRiskScore: 0,
        securityRiskLevel: 'low',
        securitySummary: null,
        securityAnalysisJson: null,
        securityReviewRequired: false,
        submitIpAddress: null,
        submitUserAgent: null,
        aiExamRecommendation: null,
        aiExamSummary: null,
        aiExamStrengths: null,
        aiExamWeaknesses: null,
        aiExamDecisionRationale: null,
        aiExamAnalysisJson: null,
        aiExamCompletedAt: null,
        aiFinalRecommendation: null,
        aiFinalSummary: null,
        aiFinalStrengths: null,
        aiFinalWeaknesses: null,
        aiFinalDecisionRationale: null,
        aiFinalAnalysisJson: null,
        aiFinalCompletedAt: null,
        trainingStatus: 'not_started',
        trainingCompletedAt: null,
        trainingEmbedViewed: false,
        trainingVideoCompleted: false,
        trainingVideoCompletedIds: null,
        trainingPdfPagesViewed: null,
        trainingCredentialsViewed: false,
        trainingAgreementAccepted: false,
        examMustCompleteBy: null,
        examInvitationSentAt: null,
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, sessionId));

    await tx
      .update(affiliateApplication)
      .set({
        status: 'qualified',
        reviewedAt: null,
        reviewerId: null,
        updatedAt: new Date(),
      })
      .where(eq(affiliateApplication.id, session.affiliateId));
  });

  await addAuditLog(sessionId, 'exam_retry_requested', {
    examAttemptCount: attemptCount,
    maxExamAttempts: maxAttempts,
  });

  return {
    status: 'training_reset',
    examAttemptCount: attemptCount,
    maxExamAttempts: maxAttempts,
    remainingAttempts: Math.max(maxAttempts - attemptCount, 0),
  };
};

// Training functions
export const getTrainingContent = async (sessionId = null) => {
  try {
    const globalContent = sessionId
      ? []
      : await db
          .select()
          .from(trainingContent)
          .where(eq(trainingContent.isActive, true))
          .orderBy(asc(trainingContent.orderIndex));
    const batchTrainingContent = sessionId
      ? await getBatchTrainingContentForSession(sessionId)
      : {
          assignedMaterials: [],
          trainingVideoUrl: '',
          trainingPdfUrl: '',
        };
    const content = sessionId
      ? batchTrainingContent.assignedMaterials
      : globalContent;
    
    const embeddedCodeContents = content.filter(
      (c) => c.contentType === 'embed_script'
    );
    const widgetContents = content.filter(
      (c) => c.contentType === 'widget_id'
    );
    const legacyWidgetContents = content.filter(
      (c) =>
        c.contentType === 'embed_code' &&
        !String(c.contentValue || '').includes('<') &&
        String(c.contentValue || '').trim()
    );
    const videoList = content.filter((c) =>
      ['video_youtube_url', 'video_direct_url', 'video_url'].includes(c.contentType)
    );
    const videoContent = videoList[0];
    const pdfContent = content.find(c => c.contentType === 'pdf_file');
    
    const embedEntries = [
      ...embeddedCodeContents.flatMap((entry) =>
        parseEmbeddedCodeEntries(entry?.contentValue || '')
      ),
      ...widgetContents.flatMap((entry) =>
        parseWidgetEntries(entry?.contentValue || '', `widget-id-${entry.id}`)
      ),
      ...legacyWidgetContents.flatMap((entry) =>
        parseWidgetEntries(entry?.contentValue || '', `legacy-widget-${entry.id}`)
      ),
    ];
    const embedScript = embedEntries.map((entry) => entry.script).join('\n');

    return {
      embedScript,
      embedWidgetId:
        widgetContents[0]?.contentValue ||
        legacyWidgetContents[0]?.contentValue ||
        '',
      embedEntries,
      videoList,
      videoUrl: videoContent?.contentValue || '',
      pdfUrl: normalizePdfUrl(pdfContent?.contentValue || ''),
      credentialsContent: content.filter((c) => c.contentType === 'credentials'),
      totalPdfPages: parseInt(process.env.TRAINING_PDF_PAGES || '10', 10),
      contentList: content,
      aiSolutionOverview: [],
    };
  } catch (error) {
    console.error('Error fetching training content:', error);
    const batchTrainingContent = sessionId
      ? await getBatchTrainingContentForSession(sessionId).catch(() => ({
          assignedMaterials: [],
          trainingVideoUrl: '',
          trainingPdfUrl: '',
        }))
      : { assignedMaterials: [], trainingVideoUrl: '', trainingPdfUrl: '' };

    const fallbackContent = Array.isArray(batchTrainingContent.assignedMaterials)
      ? batchTrainingContent.assignedMaterials
      : [];
    const videoList = fallbackContent.filter((c) =>
      ['video_youtube_url', 'video_direct_url', 'video_url'].includes(c.contentType)
    );
    const videoContent = videoList[0];
    const pdfContent = fallbackContent.find((c) => c.contentType === 'pdf_file');

    return {
      embedScript: '',
      embedWidgetId: '',
      embedEntries: [],
      videoList,
      videoUrl: videoContent?.contentValue || '',
      pdfUrl: normalizePdfUrl(pdfContent?.contentValue || ''),
      credentialsContent: [],
      totalPdfPages: parseInt(process.env.TRAINING_PDF_PAGES || '10', 10),
      contentList: fallbackContent,
      aiSolutionOverview: [],
    };
  }
};

export const getVideoInterviewQuestionsForSession = async (sessionId) => {
  const { interviewQuestionIds } = await getBatchQuestionSetForSession(sessionId);
  if (interviewQuestionIds.length === 0) {
    return [];
  }

  const conditions = [
    eq(assessmentQuestion.isActive, true),
    eq(assessmentQuestion.questionType, 'video_introduction'),
    inArray(assessmentQuestion.id, interviewQuestionIds),
  ];

  const questions = await db
    .select({
      id: assessmentQuestion.id,
      type: assessmentQuestion.questionType,
      question: assessmentQuestion.question,
      isRequired: assessmentQuestion.isRequired,
      points: assessmentQuestion.points,
      orderIndex: assessmentQuestion.orderIndex,
      videoInstructions: assessmentQuestion.videoInstructions,
    })
    .from(assessmentQuestion)
    .where(and(...conditions))
    .orderBy(assessmentQuestion.orderIndex);

  const answers = await db
    .select({
      questionId: assessmentAnswer.questionId,
      videoUrl: assessmentAnswer.videoUrl,
      id: assessmentAnswer.id,
    })
    .from(assessmentAnswer)
    .where(eq(assessmentAnswer.sessionId, sessionId));

  return questions.map((question) => {
    const answer = answers.find((item) => item.questionId === question.id);
    return {
      ...question,
      answerId: answer?.id || null,
      videoUrl: answer?.videoUrl || '',
    };
  });
};

const getSessionByTokenOrThrow = async (token) => {
  const session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.examToken, token))
    .limit(1);

  if (!session || !session[0]) {
    throw new Error('Invalid token');
  }

  return session[0];
};

export const saveVideoInterviewAnswers = async (sessionId, answers = []) => {
  if (!Array.isArray(answers)) {
    throw new Error('Video interview answers must be an array');
  }

  const sharedVideoUrl = String(
    answers.find((item) => String(item?.videoUrl || '').trim())?.videoUrl || ''
  ).trim();

  const { interviewQuestionIds } = await getBatchQuestionSetForSession(sessionId);
  if (interviewQuestionIds.length === 0) {
    throw new Error('No interview questions are configured for this batch yet');
  }

  const questionConditions = [
    eq(assessmentQuestion.isActive, true),
    eq(assessmentQuestion.questionType, 'video_introduction'),
    inArray(assessmentQuestion.id, interviewQuestionIds),
  ];

  const questions = await db
    .select({
      id: assessmentQuestion.id,
      points: assessmentQuestion.points,
      isRequired: assessmentQuestion.isRequired,
    })
    .from(assessmentQuestion)
    .where(and(...questionConditions));

  const hasRequiredQuestions = questions.some((question) => question.isRequired);
  if (hasRequiredQuestions && !sharedVideoUrl) {
    throw new Error('A single shared video interview link is required for this stage');
  }

  for (const question of questions) {
    const item = answers.find((entry) => entry.questionId === question.id);
    const normalizedVideoUrl = String(item?.videoUrl || sharedVideoUrl || '').trim();

    const existing = await db
      .select({ id: assessmentAnswer.id })
      .from(assessmentAnswer)
      .where(
        and(
          eq(assessmentAnswer.sessionId, sessionId),
          eq(assessmentAnswer.questionId, question.id)
        )
      )
      .limit(1);

    const payload = {
      sessionId,
      questionId: question.id,
      answerType: 'video_introduction',
      videoUrl: normalizedVideoUrl || null,
      selectedOption: null,
      essayAnswer: null,
      maxScore: question.points || 0,
      answeredAt: new Date(),
      updatedAt: new Date(),
    };

    if (existing[0]) {
      await db
        .update(assessmentAnswer)
        .set(payload)
        .where(eq(assessmentAnswer.id, existing[0].id));
    } else {
      await db.insert(assessmentAnswer).values({
        id: uuidv4(),
        ...payload,
        createdAt: new Date(),
      });
    }
  }

  return getVideoInterviewQuestionsForSession(sessionId);
};

export const validateInterviewToken = async (token) => {
  const sessionData = await getSessionByTokenOrThrow(token);
  return buildSessionStatePayload(sessionData);
};

export const getInterviewContent = async (token) => {
  const sessionData = await getSessionByTokenOrThrow(token);
  const payload = await buildSessionStatePayload(sessionData);

  return {
    ...payload,
    videoInterviewQuestions: await getVideoInterviewQuestionsForSession(
      sessionData.id,
    ),
    interviewSubmittedLink: sessionData.interviewSubmittedLink || '',
  };
};

export const submitInterview = async (token, videoUrl) => {
  const sessionData = await getSessionByTokenOrThrow(token);
  const normalizedVideoUrl = String(videoUrl || '').trim();

  if (!normalizedVideoUrl) {
    throw new Error('A shared Google Drive link is required for the video interview stage');
  }

  const questions = await getVideoInterviewQuestionsForSession(sessionData.id);
  await saveVideoInterviewAnswers(
    sessionData.id,
    questions.map((question) => ({
      questionId: question.id,
      videoUrl: normalizedVideoUrl,
    })),
  );

  const now = new Date();

  await db
    .update(assessmentSession)
    .set({
      interviewStatus: 'submitted',
      interviewSubmittedLink: normalizedVideoUrl,
      interviewSubmittedAt: now,
      updatedAt: now,
    })
    .where(eq(assessmentSession.id, sessionData.id));

  const refreshed = await getInterviewContent(token);
  return {
    ...refreshed,
    trainingEmailSent: Boolean(sessionData.trainingInvitationSentAt),
  };
};

export const validateTrainingToken = async (token) => {
  const sessionData = await getSessionByTokenOrThrow(token);

  if (sessionData.interviewStatus !== 'approved') {
    throw new Error('Your video interview must be approved by the team before accessing the AI training stage.');
  }
  
  // Check if training is expired (24 hours after training completion)
  if (sessionData.trainingStatus === 'completed' && sessionData.examMustCompleteBy) {
    const mustCompleteBy = new Date(sessionData.examMustCompleteBy).getTime();
    if (Date.now() > mustCompleteBy) {
      throw new Error('Training expired. Please contact support for a new exam link.');
    }
  }

  return buildSessionStatePayload(sessionData);
};

export const updateTrainingProgress = async (sessionId, progress) => {
  const session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  if (!session || !session[0]) {
    throw new Error('Session not found');
  }

  const updateData = {
    trainingStatus: session[0].trainingStatus || 'not_started',
    updatedAt: new Date(),
  };

  if (progress.embedViewed !== undefined) {
    updateData.trainingEmbedViewed = progress.embedViewed;
  }

  if (progress.videoCompleted !== undefined) {
    updateData.trainingVideoCompleted = progress.videoCompleted;
  }

  if (progress.videoCompletedIds !== undefined) {
    updateData.trainingVideoCompletedIds = JSON.stringify(
      Array.isArray(progress.videoCompletedIds)
        ? [...new Set(progress.videoCompletedIds.map((item) => String(item || '').trim()).filter(Boolean))]
        : []
    );
  }

  if (progress.pdfPagesViewed !== undefined) {
    updateData.trainingPdfPagesViewed = JSON.stringify(progress.pdfPagesViewed);
  }

  if (progress.credentialsViewed !== undefined) {
    updateData.trainingCredentialsViewed = progress.credentialsViewed;
  }

  if (progress.agreementAccepted !== undefined) {
    updateData.trainingAgreementAccepted = progress.agreementAccepted;
  }

  // Check if all training is completed
  const currentSession = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  const s = currentSession[0];

  const trainingContent = await getTrainingContent(sessionId);
  const expectedPdfPages = Number(
    progress.pdfTotalPages || trainingContent?.totalPdfPages || 0
  );
  const persistedPdfPagesViewed = (() => {
    if (!s.trainingPdfPagesViewed) return [];
    try {
      const parsed = JSON.parse(s.trainingPdfPagesViewed);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const persistedVideoCompletedIds = (() => {
    if (!s.trainingVideoCompletedIds) return [];
    try {
      const parsed = JSON.parse(s.trainingVideoCompletedIds);
      return Array.isArray(parsed)
        ? parsed.map((item) => String(item || '').trim()).filter(Boolean)
        : [];
    } catch {
      return [];
    }
  })();
  const latestVideoCompletedIds = Array.isArray(progress.videoCompletedIds)
    ? [...new Set(progress.videoCompletedIds.map((item) => String(item || '').trim()).filter(Boolean))]
    : persistedVideoCompletedIds;
  const expectedVideoIds = Array.isArray(trainingContent?.videoList)
    ? trainingContent.videoList.map((item) => String(item.id || '').trim()).filter(Boolean)
    : [];
  const allVideosCompleted =
    expectedVideoIds.length > 0 &&
    expectedVideoIds.every((videoId) => latestVideoCompletedIds.includes(videoId));
  const latestPdfPagesViewed = Array.isArray(progress.pdfPagesViewed)
    ? progress.pdfPagesViewed
    : persistedPdfPagesViewed;
  const allPdfPagesCompleted =
    expectedPdfPages === 0 || latestPdfPagesViewed.length >= expectedPdfPages;
  const credentialsRequired = Array.isArray(trainingContent?.credentialsContent) && trainingContent.credentialsContent.length > 0;

  const allCompleted = 
    allPdfPagesCompleted &&
    (progress.embedViewed || s.trainingEmbedViewed) &&
    (allVideosCompleted || progress.videoCompleted || s.trainingVideoCompleted) &&
    (!credentialsRequired || progress.credentialsViewed || s.trainingCredentialsViewed) &&
    (progress.agreementAccepted || s.trainingAgreementAccepted);

  if (progress.trainingCompleted && !allCompleted) {
    throw new Error('All training steps must be completed before finishing the training.');
  }

  if (progress.trainingCompleted || allCompleted) {
    updateData.trainingStatus = 'completed';
    updateData.trainingCompletedAt = new Date();
    
    // Set exam expiry from global settings (or fallback to 24)
    const settings = await getAssessmentSettings();
    const expiryHours = settings?.examWaitHours || 24;
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expiryHours);
    updateData.examMustCompleteBy = expiryDate;
    
    // Add audit log
    await addAuditLog(sessionId, 'training_completed', { 
      examMustCompleteBy: updateData.examMustCompleteBy 
    });
  } else if (s.trainingStatus === 'not_started') {
    updateData.trainingStatus = 'in_progress';
  }

  await db
    .update(assessmentSession)
    .set(updateData)
    .where(eq(assessmentSession.id, sessionId));

  let examEmailSent = false;
  const finalTrainingStatus = updateData.trainingStatus;
  if (finalTrainingStatus === 'completed') {
    const [sessionRow] = await db
      .select()
      .from(assessmentSession)
      .where(eq(assessmentSession.id, sessionId))
      .limit(1);

    if (sessionRow?.affiliateId && !sessionRow.examInvitationSentAt) {
      const [affiliate] = await db
        .select({
          fullName: affiliateApplication.fullName,
          email: affiliateApplication.email,
        })
        .from(affiliateApplication)
        .where(eq(affiliateApplication.id, sessionRow.affiliateId))
        .limit(1);

      if (affiliate?.email) {
        examEmailSent = await sendExamInvitationForSession(affiliate, sessionRow);
      }
    }
  }

  // Return updated session
  const updated = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  return {
    trainingStatus: updated[0].trainingStatus,
    trainingCompletedAt: updated[0].trainingCompletedAt,
    examMustCompleteBy: updated[0].examMustCompleteBy,
    examInvitationSent: examEmailSent || Boolean(updated[0].examInvitationSentAt),
  };
};

// Log real-time cheat attempts (tab switch, mouse leave, etc.)
export const logCheatAttempt = async (sessionId, eventType, eventData, ipAddress, userAgent) => {
  // Check if session exists
  const session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  if (!session || !session[0]) {
    throw new Error('Session not found');
  }

  // Log in assessmentAuditLog
  await addAuditLog(sessionId, eventType, eventData, ipAddress, userAgent);
  
  // Also increment tabSwitchCount if it's a tab switch
  if (eventType === 'tab_switch' || eventType === 'leave_window') {
    await db
      .update(assessmentSession)
      .set({
        tabSwitchCount: sql`tab_switch_count + 1`,
        updatedAt: new Date()
      })
      .where(eq(assessmentSession.id, sessionId));
  }

  return { logged: true, eventType };
};

export const startExam = async (sessionId, ipAddress = null, userAgent = null, securityData = {}) => {
  const session = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.id, sessionId))
    .limit(1);

  if (!session || !session[0]) {
    throw new Error('Session not found');
  }

  const sessionData = session[0];
  
  // Server-side training completion verification
  if (sessionData.trainingStatus !== 'completed') {
    throw new Error('Training must be completed before starting the exam');
  }

  const currentAttemptCount = Number(sessionData.examAttemptCount || 0);
  const maxExamAttempts = Number(sessionData.maxExamAttempts || DEFAULT_MAX_EXAM_ATTEMPTS);
  if (currentAttemptCount >= maxExamAttempts && String(sessionData.status) !== 'in_progress') {
    throw new Error('Maximum exam attempts reached for this application.');
  }

  // Check if training has expired (24 hours)
  if (sessionData.examMustCompleteBy) {
    const mustCompleteBy = new Date(sessionData.examMustCompleteBy).getTime();
    if (Date.now() > mustCompleteBy) {
      throw new Error('Training expired. Please contact support for a new exam link.');
    }
  }

  // If already started, don't update
  if (sessionData.startedAt) {
    return { message: 'Exam already started', startedAt: sessionData.startedAt, expiresAt: sessionData.expiresAt, status: 'in_progress', examAttemptCount: currentAttemptCount, maxExamAttempts };
  }

  // Calculate precise token expiration (duration of exam + tiny network buffer)
  const settings = await getAssessmentSettings();
  const durationMinutes = settings?.examDurationMinutes || 60;
  const normalizedStartIp = normalizeIp(ipAddress);
  
  const startedAt = new Date();
  const preciseExpiresAt = new Date(startedAt.getTime() + (durationMinutes * 60 * 1000));

  // Record start time, IP, and the exact expiration time of the exam
  await db
    .update(assessmentSession)
    .set({
      startedAt,
      expiresAt: preciseExpiresAt,
      ipAddress: normalizedStartIp,
      userAgent,
      browserFingerprint: securityData?.fingerprint || sessionData.browserFingerprint,
      status: 'in_progress',
      examAttemptCount: currentAttemptCount + 1,
      updatedAt: new Date(),
    })
    .where(eq(assessmentSession.id, sessionId));

  // Add audit log
  await addAuditLog(sessionId, 'exam_start', {
    ipAddress: normalizedStartIp,
    userAgent,
    fingerprint: securityData?.fingerprint || null,
  }, normalizedStartIp, userAgent);

  return {
    message: 'Exam started successfully',
    startedAt,
    expiresAt: preciseExpiresAt,
    status: 'in_progress',
    examAttemptCount: currentAttemptCount + 1,
    maxExamAttempts,
  };
};
