ALTER TABLE `assessment_session` ADD `ai_exam_recommendation` varchar(50);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_exam_summary` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_exam_strengths` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_exam_weaknesses` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_exam_decision_rationale` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_exam_analysis_json` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_exam_completed_at` datetime;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_final_recommendation` varchar(50);--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_final_summary` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_final_strengths` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_final_weaknesses` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_final_decision_rationale` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_final_analysis_json` text;--> statement-breakpoint
ALTER TABLE `assessment_session` ADD `ai_final_completed_at` datetime;
