ALTER TABLE affiliate_batch
  ADD COLUMN interview_question_ids JSON NULL AFTER training_pdf_url,
  ADD COLUMN exam_question_ids JSON NULL AFTER interview_question_ids;
