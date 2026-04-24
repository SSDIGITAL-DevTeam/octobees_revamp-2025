CREATE TABLE `partner_lead_note` (
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
INSERT INTO `partner_lead_note` (`id`, `lead_id`, `content`, `created_by_type`)
  SELECT UUID(), `id`, `remark`, 'partner'
  FROM `partner_lead`
  WHERE `remark` IS NOT NULL AND `remark` != '';
--> statement-breakpoint
ALTER TABLE `partner_lead` DROP COLUMN `remark`;
