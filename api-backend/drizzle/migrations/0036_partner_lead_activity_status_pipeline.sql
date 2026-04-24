ALTER TABLE `partner_lead_activity`
  MODIFY COLUMN `from_status` enum(
    'Lead Created',
    'Follow-up',
    'Proposal Sent',
    'New Leads',
    'Contacted',
    'Follow-up Day-1',
    'Follow-up Day-3',
    'Follow-up Day-7',
    'Follow-up Day-14',
    'Closed Won',
    'Closed Lost'
  );
--> statement-breakpoint

ALTER TABLE `partner_lead_activity`
  MODIFY COLUMN `to_status` enum(
    'Lead Created',
    'Follow-up',
    'Proposal Sent',
    'New Leads',
    'Contacted',
    'Follow-up Day-1',
    'Follow-up Day-3',
    'Follow-up Day-7',
    'Follow-up Day-14',
    'Closed Won',
    'Closed Lost'
  );
--> statement-breakpoint

UPDATE `partner_lead_activity`
SET `from_status` = 'New Leads'
WHERE `from_status` = 'Lead Created';
--> statement-breakpoint

UPDATE `partner_lead_activity`
SET `from_status` = 'Contacted'
WHERE `from_status` = 'Proposal Sent';
--> statement-breakpoint

UPDATE `partner_lead_activity`
SET `from_status` = 'Follow-up Day-1'
WHERE `from_status` = 'Follow-up';
--> statement-breakpoint

UPDATE `partner_lead_activity`
SET `to_status` = 'New Leads'
WHERE `to_status` = 'Lead Created';
--> statement-breakpoint

UPDATE `partner_lead_activity`
SET `to_status` = 'Contacted'
WHERE `to_status` = 'Proposal Sent';
--> statement-breakpoint

UPDATE `partner_lead_activity`
SET `to_status` = 'Follow-up Day-1'
WHERE `to_status` = 'Follow-up';
--> statement-breakpoint

ALTER TABLE `partner_lead_activity`
  MODIFY COLUMN `from_status` enum(
    'New Leads',
    'Contacted',
    'Follow-up Day-1',
    'Follow-up Day-3',
    'Follow-up Day-7',
    'Follow-up Day-14',
    'Closed Won',
    'Closed Lost'
  );
--> statement-breakpoint

ALTER TABLE `partner_lead_activity`
  MODIFY COLUMN `to_status` enum(
    'New Leads',
    'Contacted',
    'Follow-up Day-1',
    'Follow-up Day-3',
    'Follow-up Day-7',
    'Follow-up Day-14',
    'Closed Won',
    'Closed Lost'
  );
