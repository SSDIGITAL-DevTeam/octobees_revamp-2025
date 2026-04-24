ALTER TABLE `user` ADD `created_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;