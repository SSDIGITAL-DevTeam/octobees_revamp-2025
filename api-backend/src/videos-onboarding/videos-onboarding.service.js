import {
  findAllOnboardingVideos,
  saveAllOnboardingVideos,
} from "./videos-onboarding.repository.js";

export const getOnboardingVideos = async () => {
  const videos = await findAllOnboardingVideos();
  const result = {};
  videos.forEach((video) => {
    result[video.title] = {
      desktop: video.desktopUrl,
      mobile: video.mobileUrl,
    };
  });
  return result;
};

export const saveOnboardingVideos = async (videos) => {
  await saveAllOnboardingVideos(videos);
};
