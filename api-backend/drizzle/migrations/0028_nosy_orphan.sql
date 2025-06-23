ALTER TABLE `metatag` DROP FOREIGN KEY `metatag_slug_pages_slug_fk`;
--> statement-breakpoint
ALTER TABLE `metatag` ADD CONSTRAINT `metatag_slug_pages_slug_fk` FOREIGN KEY (`slug`) REFERENCES `pages`(`slug`) ON DELETE cascade ON UPDATE cascade;