import fs from "fs";
import path from "path";

const CONFIG_FILE_PATH = path.join(process.cwd(), "upload", "onboarding-videos-config.json");

const loadVideoConfig = () => {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading video config:", error);
  }
  return {};
};

const saveVideoConfig = (config) => {
  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error saving video config:", error);
    throw error;
  }
};

export const getOnboardingVideos = async () => {
  return loadVideoConfig();
};

export const saveOnboardingVideos = async (videos) => {
  const existingConfig = loadVideoConfig();
  const updatedConfig = { ...existingConfig, ...videos };
  saveVideoConfig(updatedConfig);
};
