import express from "express";
import { loginUser } from "./login.service.js";
import logger from "../../../utils/logger.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Data is not complete");
    }
    const { accessToken, refreshToken } = await loginUser(req.body);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
    // secure: true
  } catch (error) {
    logger.error(`POST LOGIN / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

export default router;
