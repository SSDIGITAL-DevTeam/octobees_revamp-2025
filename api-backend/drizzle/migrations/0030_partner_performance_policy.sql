ALTER TABLE `affiliate_application`
  ADD COLUMN `performance_alert_sent_at` datetime,
  ADD COLUMN `performance_termination_due_at` datetime,
  ADD COLUMN `performance_terminated_at` datetime;--> statement-breakpoint

CREATE TABLE `partner_performance_setting` (
  `id` varchar(36) NOT NULL,
  `basic_salary_amount` double NOT NULL DEFAULT 3500,
  `basic_salary_sales_threshold` double NOT NULL DEFAULT 35000,
  `first_month_minimum_closed_clients` int NOT NULL DEFAULT 1,
  `initial_commission_full_client_threshold` int NOT NULL DEFAULT 2,
  `termination_grace_days` int NOT NULL DEFAULT 2,
  `is_active` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `partner_performance_setting_id` PRIMARY KEY(`id`)
);--> statement-breakpoint

INSERT INTO `partner_performance_setting` (
  `id`,
  `basic_salary_amount`,
  `basic_salary_sales_threshold`,
  `first_month_minimum_closed_clients`,
  `initial_commission_full_client_threshold`,
  `termination_grace_days`,
  `is_active`
) VALUES (
  'default-partner-performance-setting',
  3500,
  35000,
  1,
  2,
  2,
  true
);
