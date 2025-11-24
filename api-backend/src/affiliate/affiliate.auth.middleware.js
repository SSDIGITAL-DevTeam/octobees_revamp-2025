import jwt from "jsonwebtoken";
import { findAffiliateUserById } from "./affiliate.repository.js";

const AFFILIATE_JWT_SECRET = process.env.AFFILIATE_JWT_SECRET;

export const affiliateJwtGuard = async (req, res, next) => {
    if (!AFFILIATE_JWT_SECRET) {
        return res.status(500).json({ message: "Affiliate JWT secret is not configured" });
    }

    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = jwt.verify(token, AFFILIATE_JWT_SECRET);
        const user = await findAffiliateUserById(payload.sub || payload.userId || payload.id);
        if (!user || !user.isActive || user.affiliateStatus !== "approved") {
            return res.status(403).json({ message: "Affiliate access revoked" });
        }
        if (user.forcePasswordChange) {
            return res.status(403).json({ message: "Password change required" });
        }
        req.affiliateUser = user;
        req.affiliateTokenPayload = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
