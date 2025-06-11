ALTER TABLE `pages` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL;