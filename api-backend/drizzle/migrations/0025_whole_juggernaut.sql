ALTER TABLE `pages` DROP INDEX `pages_categoryServiceId_unique`;--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `categoryServiceId` varchar(191) DEFAULT null;