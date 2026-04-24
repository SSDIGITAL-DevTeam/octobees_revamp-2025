ALTER TABLE `assessment_session` ADD `submit_ip_address` varchar(45);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `submit_user_agent` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `security_risk_score` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `security_risk_level` varchar(20) DEFAULT 'low';--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `security_summary` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `security_analysis_json` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `security_review_required` boolean DEFAULT false;