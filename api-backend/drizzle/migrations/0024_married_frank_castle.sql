ALTER TABLE `pages` DROP INDEX `pages_blogId_unique`;--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `blogId` varchar(191) DEFAULT null;