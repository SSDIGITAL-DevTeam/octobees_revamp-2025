import express from "express";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "../../../utils/mail.js";
import { findUserByEmail } from "../../user/user.repository.js";
import logger from "../../../utils/logger.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("Email not found");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.RESET_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${token}`;

    await sendResetEmail(user.email, resetLink);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    logger.error(`POST FORGOT-PASSWORD / error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

export default router;
