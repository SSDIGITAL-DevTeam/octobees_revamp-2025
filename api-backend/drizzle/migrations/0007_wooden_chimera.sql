ALTER TABLE `user` CHANGE COLUMN `plan_status` `user_status` enum('Draft','Active','NonActive') NOT NULL;--> statement-breakpoint
ALTER TABLE `lead` ADD `is_agree` boolean DEFAULT true;