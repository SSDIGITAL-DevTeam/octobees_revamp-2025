ALTER TABLE `pages` ADD `blogId` varchar(191);--> statement-breakpoint
ALTER TABLE `pages` ADD CONSTRAINT `pages_blogId_unique` UNIQUE(`blogId`);