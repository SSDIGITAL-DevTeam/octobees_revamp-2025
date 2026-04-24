-- Commission Rule Engine — schema changes

-- 1. commission_rule table
CREATE TABLE IF NOT EXISTS `commission_rule` (
  `id`              varchar(36)   NOT NULL,
  `name`            varchar(191)  NOT NULL,
  `description`     text          NULL,
  `trigger_type`    enum('lead_won','daily_cron','monthly_cron','manual') NOT NULL,
  `commission_type` varchar(80)   NOT NULL,
  `rule_scope`      enum('per_lead','per_period') NOT NULL DEFAULT 'per_period',
  `period_scope`    enum('first_month','current_month','any_month') NOT NULL DEFAULT 'current_month',
  `conditions`      json          NULL,
  `reward`          json          NULL,
  `is_active`       tinyint(1)    NOT NULL DEFAULT 1,
  `priority`        int           NOT NULL DEFAULT 0,
  `created_at`      timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint

-- 2. commission_rule_log table
CREATE TABLE IF NOT EXISTS `commission_rule_log` (
  `id`            varchar(36)  NOT NULL,
  `rule_id`       varchar(36)  NOT NULL,
  `affiliate_id`  varchar(36)  NOT NULL,
  `lead_id`       varchar(36)  NULL,
  `period`        varchar(7)   NULL,
  `outcome`       enum('skipped','created','updated','error') NOT NULL,
  `reason`        text         NULL,
  `amount`        double       NULL,
  `evaluated_at`  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `crl_rule_id_fk`
    FOREIGN KEY (`rule_id`) REFERENCES `commission_rule` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
