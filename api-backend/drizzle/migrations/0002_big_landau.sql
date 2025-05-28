CREATE TABLE `career` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	`position` varchar(255) NOT NULL,
	`resume` text NOT NULL,
	`portfolio` varchar(255) NOT NULL,
	`message` text,
	`status` enum('Rejected','Review','Accepted') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `career_id` PRIMARY KEY(`id`),
	CONSTRAINT `career_email_unique` UNIQUE(`email`)
);
