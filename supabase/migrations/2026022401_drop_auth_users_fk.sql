-- Drop all foreign key constraints referencing auth.users(id).
--
-- The app uses a custom cookie-based auth system with deterministic UUIDs
-- generated from email hashes (see /api/auth/login/verify). These UUIDs
-- are never inserted into Supabase's auth.users table, so every INSERT
-- that includes user_id fails with a FK violation.
--
-- The service_role key already bypasses RLS. Removing the FK constraints
-- allows the deterministic UUID scheme to work as designed.

-- Core assessment tables (from 2026021302)
ALTER TABLE assessment_runs
  DROP CONSTRAINT IF EXISTS assessment_runs_user_id_fkey;

ALTER TABLE assessment_responses
  DROP CONSTRAINT IF EXISTS assessment_responses_user_id_fkey;

ALTER TABLE assessment_results
  DROP CONSTRAINT IF EXISTS assessment_results_user_id_fkey;

ALTER TABLE assessment_reports
  DROP CONSTRAINT IF EXISTS assessment_reports_user_id_fkey;

-- Entitlements (from 2026021401)
-- user_id is the PK and also references auth.users — drop only the FK part.
ALTER TABLE user_entitlements
  DROP CONSTRAINT IF EXISTS user_entitlements_user_id_fkey;

-- Retention loop tables (from 2026021403)
ALTER TABLE email_jobs
  DROP CONSTRAINT IF EXISTS email_jobs_user_id_fkey;

ALTER TABLE morning_entries
  DROP CONSTRAINT IF EXISTS morning_entries_user_id_fkey;

ALTER TABLE micro_joy_entries
  DROP CONSTRAINT IF EXISTS micro_joy_entries_user_id_fkey;

-- Reps (from 2026021902)
ALTER TABLE reps
  DROP CONSTRAINT IF EXISTS reps_user_id_fkey;

-- Daily loops (from 2026022001)
ALTER TABLE daily_loops
  DROP CONSTRAINT IF EXISTS daily_loops_user_id_fkey;

-- Energy audits (from 2026022002)
ALTER TABLE energy_audits
  DROP CONSTRAINT IF EXISTS energy_audits_user_id_fkey;

-- Evening reflections (from 2026022003)
ALTER TABLE evening_reflections
  DROP CONSTRAINT IF EXISTS evening_reflections_user_id_fkey;

-- If/Then plans (from 2026022004)
ALTER TABLE if_then_plans
  DROP CONSTRAINT IF EXISTS if_then_plans_user_id_fkey;

-- Phase check-ins (from 2026022005)
ALTER TABLE phase_checkins
  DROP CONSTRAINT IF EXISTS phase_checkins_user_id_fkey;

-- Assessment reflections (from 2026022301)
ALTER TABLE assessment_reflections
  DROP CONSTRAINT IF EXISTS assessment_reflections_user_id_fkey;
