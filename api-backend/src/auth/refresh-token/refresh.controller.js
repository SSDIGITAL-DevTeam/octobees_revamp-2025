import express from 'express'
import { verifyRefreshToken } from "./refresh.service.js";
import logger from '../../../utils/logger.js';

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            logger.error(`GET REFRESH-TOKEN / error: Refresh token not found`);
            throw new Error(401)
        }
        const accessToken = await verifyRefreshToken(token)
        res.status(200).json({ accessToken });
    } catch (error) {
        logger.error(`GET REFRESH-TOKEN / error: ${error.message}`);
        res.sendStatus(Number(error.message))
    }
})

export default router