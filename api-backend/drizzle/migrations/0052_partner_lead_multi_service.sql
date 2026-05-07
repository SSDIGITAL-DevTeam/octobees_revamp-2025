-- Multi-service per lead: junction table
-- Replaces the 1-to-1 service_id on partner_lead with a 1-to-many relation.

CREATE TABLE IF NOT EXISTS `partner_lead_service` (
  `id`                      varchar(36)  NOT NULL,
  `lead_id`                 varchar(36)  NOT NULL,
  `service_id`              varchar(36)  NOT NULL,
  `project_value`           double       NOT NULL DEFAULT 0,
  `is_custom_project_value` tinyint(1)   NOT NULL DEFAULT 0,
  `created_at`              timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_lead_service` (`lead_id`, `service_id`),
  CONSTRAINT `pls_lead_id_fk`
    FOREIGN KEY (`lead_id`) REFERENCES `partner_lead` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pls_service_id_fk`
    FOREIGN KEY (`service_id`) REFERENCES `partner_service` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint

-- Migrate existing single-service data into the junction table
INSERT INTO `partner_lead_service` (`id`, `lead_id`, `service_id`, `project_value`, `is_custom_project_value`)
SELECT UUID(), `id`, `service_id`, `project_value`, `is_custom_project_value`
FROM `partner_lead`
WHERE `service_id` IS NOT NULL;
--> statement-breakpoint

-- Make legacy columns nullable (deprecated; source of truth is now partner_lead_service)
ALTER TABLE `partner_lead`
  MODIFY COLUMN `service_id`              varchar(36)  NULL,
  MODIFY COLUMN `project_value`           double       NULL DEFAULT 0,
  MODIFY COLUMN `is_custom_project_value` tinyint(1)   NULL DEFAULT 0;
