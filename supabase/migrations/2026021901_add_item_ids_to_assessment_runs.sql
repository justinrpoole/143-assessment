alter table public.assessment_runs
add column if not exists item_ids jsonb default null;
