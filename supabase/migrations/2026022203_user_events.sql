-- Event capture table for progressive analytics (Enhancement 8).
-- Captures now, surfaces later. Write-heavy, read-light initially.

CREATE TABLE IF NOT EXISTS user_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  event_type  TEXT NOT NULL,
  event_data  JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for user-scoped queries (timeline, aggregation)
CREATE INDEX IF NOT EXISTS idx_user_events_user_created
  ON user_events (user_id, created_at DESC);

-- Index for event-type filtering
CREATE INDEX IF NOT EXISTS idx_user_events_type
  ON user_events (event_type, created_at DESC);

-- RLS: users can only read their own events
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_events_select ON user_events
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY user_events_insert ON user_events
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
