<<<<<<< HEAD
CREATE TABLE `partner_vertical_market` (
=======
CREATE TABLE IF NOT EXISTS `partner_vertical_market` (
>>>>>>> 8da069e8189d7a87105cb5c55aa10adf94490304
  `id` varchar(36) NOT NULL,
  `name` varchar(120) NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `is_active` boolean NOT NULL DEFAULT true,
  `is_system` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `partner_vertical_market_id` PRIMARY KEY(`id`),
  CONSTRAINT `partner_vertical_market_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint

<<<<<<< HEAD
INSERT INTO `partner_vertical_market`
=======
INSERT IGNORE INTO `partner_vertical_market`
>>>>>>> 8da069e8189d7a87105cb5c55aa10adf94490304
  (`id`, `name`, `sort_order`, `is_active`, `is_system`)
VALUES
  (UUID(), 'Digital Agency', 1, true, true),
  (UUID(), 'Education', 2, true, true),
  (UUID(), 'Healthcare', 3, true, true),
  (UUID(), 'Real Estate', 4, true, true),
  (UUID(), 'Retail & Ecommerce', 5, true, true),
  (UUID(), 'Food & Beverage', 6, true, true),
  (UUID(), 'Finance & Insurance', 7, true, true),
  (UUID(), 'Professional Services', 8, true, true);
--> statement-breakpoint

<<<<<<< HEAD
ALTER TABLE `partner_lead`
  ADD COLUMN `vertical_market_id` varchar(36) NULL,
  ADD COLUMN `vertical_market_name` varchar(120) NULL,
  ADD COLUMN `is_custom_project_value` boolean NOT NULL DEFAULT false;
--> statement-breakpoint

ALTER TABLE `partner_lead`
  ADD CONSTRAINT `partner_lead_vertical_market_id_partner_vertical_market_id_fk`
  FOREIGN KEY (`vertical_market_id`) REFERENCES `partner_vertical_market`(`id`) ON DELETE SET NULL;
=======
-- Add vertical_market_id column (guarded)
SET @col_vmi := (SELECT IF(COUNT(*) = 0,
  'ALTER TABLE `partner_lead` ADD COLUMN `vertical_market_id` varchar(36) NULL',
  'SELECT 1'
) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'partner_lead'
  AND COLUMN_NAME = 'vertical_market_id');
--> statement-breakpoint
PREPARE stmt FROM @col_vmi;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Add vertical_market_name column (guarded)
SET @col_vmn := (SELECT IF(COUNT(*) = 0,
  'ALTER TABLE `partner_lead` ADD COLUMN `vertical_market_name` varchar(120) NULL',
  'SELECT 1'
) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'partner_lead'
  AND COLUMN_NAME = 'vertical_market_name');
--> statement-breakpoint
PREPARE stmt FROM @col_vmn;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Add is_custom_project_value column (guarded)
SET @col_cpv := (SELECT IF(COUNT(*) = 0,
  'ALTER TABLE `partner_lead` ADD COLUMN `is_custom_project_value` boolean NOT NULL DEFAULT false',
  'SELECT 1'
) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'partner_lead'
  AND COLUMN_NAME = 'is_custom_project_value');
--> statement-breakpoint
PREPARE stmt FROM @col_cpv;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Add FK constraint (guarded)
SET @fk_exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'partner_lead'
  AND CONSTRAINT_NAME = 'partner_lead_vertical_market_id_partner_vertical_market_id_fk');
--> statement-breakpoint
SET @add_fk := IF(@fk_exists = 0,
  'ALTER TABLE `partner_lead` ADD CONSTRAINT `partner_lead_vertical_market_id_partner_vertical_market_id_fk` FOREIGN KEY (`vertical_market_id`) REFERENCES `partner_vertical_market`(`id`) ON DELETE SET NULL',
  'SELECT 1'
);
--> statement-breakpoint
PREPARE stmt FROM @add_fk;
--> statement-breakpoint
EXECUTE stmt;
--> statement-breakpoint
DEALLOCATE PREPARE stmt;
>>>>>>> 8da069e8189d7a87105cb5c55aa10adf94490304
