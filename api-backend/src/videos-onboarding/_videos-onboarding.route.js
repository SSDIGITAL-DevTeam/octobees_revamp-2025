import express from "express";
import videos from "./videos-onboarding.controller.js";

const router = express.Router();

router.get("/videos", videos.getVideos);
router.post("/videos/save", videos.saveVideos);

export default router;
