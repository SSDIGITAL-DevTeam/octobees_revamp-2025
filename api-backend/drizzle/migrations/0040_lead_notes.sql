CREATE TABLE IF NOT EXISTS `partner_lead_note` (
  `id` varchar(36) NOT NULL,
  `lead_id` varchar(36) NOT NULL,
  `content` text NOT NULL,
  `created_by_type` varchar(20) NOT NULL DEFAULT 'partner',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `partner_lead_note_id` PRIMARY KEY(`id`),
  CONSTRAINT `partner_lead_note_lead_id_fk`
    FOREIGN KEY (`lead_id`) REFERENCES `partner_lead`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint

-- Migrate existing remarks to notes only if remark column still exists
SET @has_remark := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND COLUMN_NAME = 'remark');
SET @sql := IF(@has_remark > 0, 'INSERT INTO `partner_lead_note` (`id`, `lead_id`, `content`, `created_by_type`) SELECT UUID(), `id`, `remark`, ''partner'' FROM `partner_lead` WHERE `remark` IS NOT NULL AND `remark` != ''''', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guard DROP COLUMN: only drop if column still exists
SET @sql := (SELECT IF(COUNT(*) > 0, 'ALTER TABLE `partner_lead` DROP COLUMN `remark`', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND COLUMN_NAME = 'remark');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
