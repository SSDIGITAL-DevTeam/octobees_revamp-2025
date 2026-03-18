import express from "express";
import videos from "./videos-onboarding.controller.js";
import { uploadVideo } from "../middleware/uploadFile.js";

const router = express.Router();

router.get("/videos", videos.getVideos);
router.post("/videos/upload", uploadVideo.fields([{ name: "desktop", maxCount: 1 }, { name: "mobile", maxCount: 1 }]), videos.uploadVideos);

export default router;
