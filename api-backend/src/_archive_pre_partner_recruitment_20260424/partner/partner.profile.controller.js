import { updateAffiliateProfile } from "./partner.service.js";
import { getAffiliateProfileByUserId } from "../affiliate/affiliate.repository.js";

// GET /profile - Get partner profile
const get = async (req, res) => {
    try {
        const affiliateUserId = req.affiliateUser.id;
        const profile = await getAffiliateProfileByUserId(affiliateUserId);

        if (!profile) {
            return res.status(404).json({
                status: "error",
                message: "Profile not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                username: profile.fullName,
                email: profile.email,
                phoneNumber: profile.phone,
                country: profile.country,
                bankName: profile.bankName,
                bankAccountNumber: profile.bankAccountNumber,
                bankAccountHolder: profile.bankAccountHolder,
                bankAccountCompleted: Boolean(
                    profile.bankName && profile.bankAccountNumber && profile.bankAccountHolder
                ),
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// PUT /profile - Update profile
const update = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const profileData = req.body;

        const result = await updateAffiliateProfile(affiliateId, profileData);

        res.status(200).json({
            status: "success",
            message: result.message,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// POST /profile/change-email - Change email
const changeEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;

        if (!newEmail) {
            return res.status(400).json({
                status: "error",
                message: "New email is required",
            });
        }

        // TODO: Implement email change logic
        // This should:
        // 1. Validate email format
        // 2. Check if email is already in use
        // 3. Send verification email
        // 4. Update email after verification

        res.status(200).json({
            status: "success",
            message: "Email change request sent. Please check your email for verification.",
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

export default {
    get,
    update,
    changeEmail,
};
