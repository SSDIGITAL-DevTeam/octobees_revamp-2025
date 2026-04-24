RENAME TABLE `order` TO `lead`;--> statement-breakpoint
ALTER TABLE `lead` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `lead` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `lead` ADD `phone` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `lead` DROP COLUMN `amount`;--> statement-breakpoint
ALTER TABLE `lead` DROP COLUMN `date`;--> statement-breakpoint
ALTER TABLE `lead` DROP COLUMN `phone_number`;--> statement-breakpoint
ALTER TABLE `lead` DROP COLUMN `time`;