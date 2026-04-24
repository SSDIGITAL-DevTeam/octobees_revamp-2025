-- Guarded ADD COLUMN: partner_lead.next_follow_up_at
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `partner_lead` ADD `next_follow_up_at` datetime', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND COLUMN_NAME = 'next_follow_up_at');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: partner_lead.last_contact_at
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `partner_lead` ADD `last_contact_at` datetime', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND COLUMN_NAME = 'last_contact_at');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

-- Guarded ADD COLUMN: partner_lead.last_status_changed_at
SET @sql := (SELECT IF(COUNT(*) = 0, 'ALTER TABLE `partner_lead` ADD `last_status_changed_at` datetime', 'SELECT 1') FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'partner_lead' AND COLUMN_NAME = 'last_status_changed_at');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `partner_lead_activity` (
  `id` varchar(36) NOT NULL,
  `lead_id` varchar(36) NOT NULL,
  `affiliate_id` varchar(36) NOT NULL,
  `actor_type` varchar(32) NOT NULL,
  `actor_id` varchar(64),
  `action_type` varchar(64) NOT NULL,
  `from_status` enum('Lead Created','Follow-up','Proposal Sent','Closed Won','Closed Lost'),
  `to_status` enum('Lead Created','Follow-up','Proposal Sent','Closed Won','Closed Lost'),
  `note` text,
  `metadata` text,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `partner_lead_activity_id` PRIMARY KEY(`id`),
  CONSTRAINT `partner_lead_activity_lead_id_partner_lead_id_fk`
    FOREIGN KEY (`lead_id`) REFERENCES `partner_lead`(`id`) ON DELETE cascade,
  CONSTRAINT `partner_lead_activity_affiliate_id_affiliate_application_id_fk`
    FOREIGN KEY (`affiliate_id`) REFERENCES `affiliate_application`(`id`) ON DELETE cascade
);
