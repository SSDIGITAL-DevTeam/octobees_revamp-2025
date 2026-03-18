import { db } from "../../drizzle/db.js";
import { onboardingVideos } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";
import logger from "../../utils/logger.js";

export const findAllOnboardingVideos = async () => {
  try {
    return await db.query.onboardingVideos.findMany();
  } catch (error) {
    logger.error(`GET onboarding_videos error: ${error.message}`);
    throw new Error("Get all onboarding videos unsuccessfully");
  }
};

export const findOnboardingVideoByTitle = async (title) => {
  try {
    return await db.query.onboardingVideos.findFirst({
      where: eq(onboardingVideos.title, title),
    });
  } catch (error) {
    logger.error(`GET onboarding_videos by title error: ${error.message}`);
    throw new Error("Get onboarding video by title unsuccessfully");
  }
};

export const upsertOnboardingVideo = async (title, desktopUrl, mobileUrl) => {
  try {
    const existing = await findOnboardingVideoByTitle(title);
    
    if (existing) {
      const updateData = {};
      if (desktopUrl !== undefined) updateData.desktopUrl = desktopUrl;
      if (mobileUrl !== undefined) updateData.mobileUrl = mobileUrl;
      updateData.updatedAt = new Date();
      
      await db
        .update(onboardingVideos)
        .set(updateData)
        .where(eq(onboardingVideos.id, existing.id));
        
      return { ...existing, ...updateData };
    } else {
      await db
        .insert(onboardingVideos)
        .values({
          title,
          desktopUrl: desktopUrl || null,
          mobileUrl: mobileUrl || null,
        });
        
      return await findOnboardingVideoByTitle(title);
    }
  } catch (error) {
    logger.error(`UPSERT onboarding_videos error: ${error.message}`);
    throw new Error("Upsert onboarding video unsuccessfully");
  }
};

export const saveAllOnboardingVideos = async (videos) => {
  try {
    for (const [title, urls] of Object.entries(videos)) {
      await upsertOnboardingVideo(
        title,
        urls.desktop || null,
        urls.mobile || null
      );
    }
    return await findAllOnboardingVideos();
  } catch (error) {
    logger.error(`SAVE ALL onboarding_videos error: ${error.message}`);
    throw new Error("Save all onboarding videos unsuccessfully");
  }
};
