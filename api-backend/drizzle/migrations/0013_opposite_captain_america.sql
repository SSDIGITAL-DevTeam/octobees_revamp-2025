ALTER TABLE `metatag` ADD `createdAt` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `metatag` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL;