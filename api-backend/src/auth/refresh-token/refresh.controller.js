import express from 'express'
import { verifyRefreshToken } from "./refresh.service.js";
import logger from '../../../utils/logger.js';

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            console.log("Token not found");
            throw new Error(401)
        }
        const accessToken = await verifyRefreshToken(token)
        res.status(200).json({ accessToken });
    } catch (error) {
        logger.error(`GET /refresh-token error: ${error.message}`);
        res.sendStatus(Number(error.message))
    }
})

export default router