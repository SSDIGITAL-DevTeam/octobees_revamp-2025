import {
  getOnboardingVideos,
  saveOnboardingVideos,
} from "./videos-onboarding.service.js";

const getVideos = async (req, res) => {
  try {
    const videos = await getOnboardingVideos();
    res.status(200).json(videos);
  } catch (error) {
    console.error(`GET /videos-onboarding error: ${error.message}`);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const saveVideos = async (req, res) => {
  try {
    const videos = req.body;
    await saveOnboardingVideos(videos);
    res.status(200).json({ message: "Video URLs berhasil disimpan" });
  } catch (error) {
    console.error(`POST /videos-onboarding/save error: ${error.message}`);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export default {
  getVideos,
  saveVideos,
};
