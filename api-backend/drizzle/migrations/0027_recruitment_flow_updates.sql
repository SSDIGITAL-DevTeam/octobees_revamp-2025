ALTER TABLE assessment_session
  ADD COLUMN interview_reviewed_at DATETIME NULL AFTER interview_invitation_sent_at,
  ADD COLUMN interview_reviewer_id VARCHAR(36) NULL AFTER interview_reviewed_at,
  ADD COLUMN interview_review_notes TEXT NULL AFTER interview_reviewer_id,
  ADD COLUMN exam_invitation_sent_at DATETIME NULL AFTER training_invitation_sent_at,
  ADD COLUMN exam_attempt_count INT NOT NULL DEFAULT 0 AFTER exam_must_complete_by,
  ADD COLUMN max_exam_attempts INT NOT NULL DEFAULT 3 AFTER exam_attempt_count;
