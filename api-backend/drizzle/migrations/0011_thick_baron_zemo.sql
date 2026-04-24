CREATE TABLE `metas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`content` text,
	`metaable_id` varchar(36) NOT NULL,
	`metaable_type` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metas_id` PRIMARY KEY(`id`)
);
