ALTER TABLE `affiliate_batch`
  ADD COLUMN `initial_commission_amount` double NOT NULL DEFAULT 0;--> statement-breakpoint

ALTER TABLE `affiliate_application`
  ADD COLUMN `initial_commission_amount` double NOT NULL DEFAULT 0;--> statement-breakpoint

UPDATE `affiliate_application` aa
LEFT JOIN `affiliate_batch` ab ON ab.`id` = aa.`batch_id`
SET aa.`initial_commission_amount` = COALESCE(ab.`initial_commission_amount`, 0);
