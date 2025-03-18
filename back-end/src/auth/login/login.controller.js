import express from 'express'
import { z } from 'zod';
import { loginUser } from './login.service.js';

const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Data tidak lengkap");
        }
        const { accessToken, refreshToken } = await loginUser(req.body)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true
        })
        res.status(200).json({ accessToken });


    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
            });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

export default router