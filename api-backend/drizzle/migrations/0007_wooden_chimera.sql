ALTER TABLE `user` RENAME COLUMN `plan_status` TO `user_status`;--> statement-breakpoint
ALTER TABLE `lead` ADD `is_agree` boolean DEFAULT true;