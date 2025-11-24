import {
    loginAffiliateAccount,
    changeAffiliatePassword,
    requestAffiliatePasswordReset,
} from "./affiliate.auth.service.js";

const login = async (req, res) => {
    try {
        const result = await loginAffiliateAccount(req.body, {
            ip: req.ip,
            userAgent: req.get("user-agent"),
        });
        res.status(200).json({ status: "success", data: result });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const result = await changeAffiliatePassword(req.body);
        res.status(200).json({ status: "success", data: result });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const result = await requestAffiliatePasswordReset(req.body);
        res.status(200).json({ status: "success", data: result });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

export default { login, changePassword, forgotPassword };
