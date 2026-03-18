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

const uploadVideos = async (req, res) => {
  try {
    const { desktopKey, mobileKey } = req.body;
    
    const videos = {};
    
    if (req.files) {
      const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      
      files.forEach((file) => {
        const filePath = `/uploads/videos/${file.filename}`;
        if (file.fieldname === 'desktop' && desktopKey) {
          videos[desktopKey] = { ...videos[desktopKey], desktop: filePath };
        }
        if (file.fieldname === 'mobile' && mobileKey) {
          videos[mobileKey] = { ...videos[mobileKey], mobile: filePath };
        }
      });
    }
    
    await saveOnboardingVideos(videos);
    res.status(200).json({ message: "Video berhasil diupload" });
  } catch (error) {
    console.error(`POST /videos-onboarding/upload error: ${error.message}`);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export default {
  getVideos,
  uploadVideos,
};
