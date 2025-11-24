import dayjs from "dayjs";
import {
    getAffiliateProfileByUserId,
    aggregateAffiliatePerformance,
    listAffiliateTransactions,
    listAffiliateReferrals,
} from "./affiliate.repository.js";

const parseDate = (value) => (value ? dayjs(value).toDate() : null);

export const getAffiliateProfileSummary = async (affiliateUserId) => {
    const profile = await getAffiliateProfileByUserId(affiliateUserId);
    if (!profile) {
        throw new Error("Affiliate profile not found");
    }
    const stats = await aggregateAffiliatePerformance(profile.affiliateId);
    return { profile, stats };
};

export const getAffiliateStatsWithRange = async (affiliateId, query = {}) => {
    const from = parseDate(query.from);
    const to = parseDate(query.to);
    return aggregateAffiliatePerformance(affiliateId, { from, to });
};

export const getAffiliateTransactions = async (affiliateId, query = {}) => {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    return listAffiliateTransactions({ affiliateId, page, limit });
};

export const getAffiliateReferrals = async (affiliateId, query = {}) => {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    return listAffiliateReferrals({ affiliateId, page, limit });
};
