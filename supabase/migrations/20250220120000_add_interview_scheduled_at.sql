-- Store scheduled interview datetime for "interview_scheduled" applications.
-- Run this in Supabase SQL Editor if the column does not exist yet.
ALTER TABLE new_application
ADD COLUMN IF NOT EXISTS interview_scheduled_at TEXT;

COMMENT ON COLUMN new_application.interview_scheduled_at IS 'ISO-like datetime string (e.g. 2025-02-20T14:30:00) when the interview is scheduled; used to show Mark as completed / Reschedule after the slot passes.';
