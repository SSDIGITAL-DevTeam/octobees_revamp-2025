import {
    getAffiliateProfileSummary,
    getAffiliateStatsWithRange,
    getAffiliateTransactions,
    getAffiliateReferrals,
} from "./affiliate.dashboard.service.js";

const me = async (req, res) => {
    try {
        const result = await getAffiliateProfileSummary(req.affiliateUser.id);
        res.status(200).json({ status: "success", data: result });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

const stats = async (req, res) => {
    try {
        const data = await getAffiliateStatsWithRange(req.affiliateUser.affiliateId, req.query);
        res.status(200).json({ status: "success", data });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

const transactions = async (req, res) => {
    try {
        const data = await getAffiliateTransactions(req.affiliateUser.affiliateId, req.query);
        res.status(200).json({ status: "success", data });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

const referrals = async (req, res) => {
    try {
        const data = await getAffiliateReferrals(req.affiliateUser.affiliateId, req.query);
        res.status(200).json({ status: "success", data });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export default { me, stats, transactions, referrals };
