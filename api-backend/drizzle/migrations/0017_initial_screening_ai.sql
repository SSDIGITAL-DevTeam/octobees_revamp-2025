ALTER TABLE `assessment_settings`
  ADD COLUMN `screening_passing_score` int NOT NULL DEFAULT 80;--> statement-breakpoint

ALTER TABLE `affiliate_application`
  ADD COLUMN `screening_score` double,
  ADD COLUMN `screening_passing_score` int DEFAULT 80,
  ADD COLUMN `screening_recommendation` varchar(50),
  ADD COLUMN `screening_summary` text,
  ADD COLUMN `screening_strengths` text,
  ADD COLUMN `screening_weaknesses` text,
  ADD COLUMN `screening_analysis_json` text,
  ADD COLUMN `screening_completed_at` datetime;
