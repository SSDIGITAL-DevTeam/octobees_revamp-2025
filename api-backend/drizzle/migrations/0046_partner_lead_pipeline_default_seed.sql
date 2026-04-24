INSERT IGNORE INTO `partner_lead_pipeline_status`
  (`id`, `value`, `label`, `color`, `sort_order`, `is_active`, `is_system`)
VALUES
  (UUID(), 'New Leads', 'New Leads', 'blue', 1, true, true),
  (UUID(), 'Contacted', 'Contacted', 'purple', 2, true, true),
  (UUID(), 'Won', 'Won', 'green', 3, true, true),
  (UUID(), 'Lost', 'Lost', 'red', 4, true, true);
--> statement-breakpoint
UPDATE `partner_lead_pipeline_status`
SET
  `sort_order` = CASE `value`
    WHEN 'New Leads' THEN 1
    WHEN 'Contacted' THEN 2
    WHEN 'Won' THEN 3
    WHEN 'Lost' THEN 4
    ELSE `sort_order`
  END,
  `is_active` = CASE
    WHEN `value` IN ('New Leads', 'Contacted', 'Won', 'Lost') THEN true
    ELSE `is_active`
  END,
  `updated_at` = CURRENT_TIMESTAMP
WHERE `value` IN ('New Leads', 'Contacted', 'Won', 'Lost');
--> statement-breakpoint
DELETE FROM `partner_lead_pipeline_status`
WHERE `value` IN (
  'Follow-up Day-1',
  'Follow-up Day-3',
  'Follow-up Day-7',
  'Follow-up Day-14'
);
