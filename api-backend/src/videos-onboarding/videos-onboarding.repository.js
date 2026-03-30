import { db } from "../../drizzle/db.js";
import { onboardingVideos } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";
import logger from "../../utils/logger.js";

const DEFAULT_VIDEO_TITLES = [
  "welcome",
  "company-profile",
  "product-overview",
  "marketing-kit",
  "affiliate-program",
  "next-steps",
];

export const initializeOnboardingVideos = async () => {
  try {
    for (const title of DEFAULT_VIDEO_TITLES) {
      const existing = await db.query.onboardingVideos.findFirst({
        where: eq(onboardingVideos.title, title),
      });

      if (!existing) {
        await db
          .insert(onboardingVideos)
          .values({ title })
          .onDuplicateKeyUpdate({ set: { title } });
      }
    }
    logger.info("Onboarding videos initialized successfully");
  } catch (error) {
    logger.error(`Initialize onboarding_videos error: ${error.message}`);
  }
};

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
      if (desktopUrl !== undefined && desktopUrl !== null) {
        updateData.desktopUrl = desktopUrl;
      }
      if (mobileUrl !== undefined && mobileUrl !== null) {
        updateData.mobileUrl = mobileUrl;
      }

      if (Object.keys(updateData).length > 0) {
        await db
          .update(onboardingVideos)
          .set(updateData)
          .where(eq(onboardingVideos.id, existing.id));
      }

      return await findOnboardingVideoByTitle(title);
    } else {
      await db
        .insert(onboardingVideos)
        .values({
          title,
          desktopUrl: desktopUrl || null,
          mobileUrl: mobileUrl || null,
        })
        .onDuplicateKeyUpdate({ set: {
          desktopUrl: desktopUrl || null,
          mobileUrl: mobileUrl || null,
        }});

      return await findOnboardingVideoByTitle(title);
    }
  } catch (error) {
    logger.error(`UPSERT onboarding_videos error: ${error.message}`);
    throw new Error("Upsert onboarding video unsuccessfully");
  }
};

export const saveAllOnboardingVideos = async (videos) => {
  try {
    await initializeOnboardingVideos();

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
