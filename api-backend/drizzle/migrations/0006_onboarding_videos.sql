CREATE TABLE `onboarding_videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `desktop_url` text,
  `mobile_url` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `onboarding_videos_id` PRIMARY KEY(`id`),
  CONSTRAINT `onboarding_videos_title_unique` UNIQUE(`title`)
);
