ALTER TABLE `affiliate_batch`
  ADD COLUMN `ai_screening_summary` text,
  ADD COLUMN `ai_screening_decision_rationale` text,
  ADD COLUMN `ai_screening_top_signals` json,
  ADD COLUMN `ai_screening_risk_signals` json,
  ADD COLUMN `ai_screening_ranked_candidates` json,
  ADD COLUMN `ai_screening_trigger` varchar(64),
  ADD COLUMN `ai_screening_completed_at` datetime;
