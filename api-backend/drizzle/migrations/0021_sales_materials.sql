CREATE TABLE IF NOT EXISTS `sales_material` (
  `id` varchar(36) NOT NULL,
  `title` varchar(191) NOT NULL,
  `summary` text,
  `material_type` enum('rich_text','file','video','link') NOT NULL DEFAULT 'rich_text',
  `content` text,
  `external_url` text,
  `file_url` text,
  `file_name` varchar(255),
  `mime_type` varchar(120),
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `sales_material_id` PRIMARY KEY(`id`)
);
