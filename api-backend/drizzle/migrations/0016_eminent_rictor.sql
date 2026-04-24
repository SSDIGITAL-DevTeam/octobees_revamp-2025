CREATE TABLE IF NOT EXISTS `assessment_settings` (
	`id` varchar(36) NOT NULL,
	`exam_wait_hours` int NOT NULL DEFAULT 24,
	`exam_duration_minutes` int NOT NULL DEFAULT 60,
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_settings_id` PRIMARY KEY(`id`)
);
