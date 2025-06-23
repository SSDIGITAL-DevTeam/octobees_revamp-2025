ALTER TABLE `career` DROP FOREIGN KEY `career_positionId_position_id_fk`;
--> statement-breakpoint
ALTER TABLE `pages` MODIFY COLUMN `source` varchar(191) NOT NULL DEFAULT 'none';--> statement-breakpoint
ALTER TABLE `career` ADD CONSTRAINT `career_positionId_position_id_fk` FOREIGN KEY (`positionId`) REFERENCES `position`(`id`) ON DELETE cascade ON UPDATE no action;