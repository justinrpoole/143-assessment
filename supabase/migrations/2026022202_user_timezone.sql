-- Add timezone column to app_users for timezone-safe date calculations
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS timezone TEXT NOT NULL DEFAULT 'UTC';
