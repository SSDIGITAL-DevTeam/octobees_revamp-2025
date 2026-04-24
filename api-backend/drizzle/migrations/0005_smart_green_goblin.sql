ALTER TABLE `lead` MODIFY COLUMN `message` text;--> statement-breakpoint
ALTER TABLE `lead` ADD `company_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `lead` ADD `company_website` varchar(255) NOT NULL;