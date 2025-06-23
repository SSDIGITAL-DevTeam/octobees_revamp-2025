import express from 'express'
import { deleteRefreshToken } from './logout.service.js';
import logger from '../../../utils/logger.js';

const router = express.Router()

router.delete("/", async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new Error(204)
        }
        const response = await deleteRefreshToken(token);
        if (!response) {
            throw new Error(204)
        }
        res.clearCookie("refreshToken");
        res.sendStatus(200)
    } catch (error) {
        logger.error(`DELETE LOGOUT / error: ${error.message}`);
        res.sendStatus(Number(error.message))
    }
})

export default router