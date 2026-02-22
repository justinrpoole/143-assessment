-- Add R-E-P-S structured columns to reps table
-- REPS = Recognition • Encouragement • Performance • Sustainability
-- Full REPS mode populates these; Quick Log mode leaves them null.

alter table public.reps add column if not exists recognition text;
alter table public.reps add column if not exists encouragement text;
alter table public.reps add column if not exists performance text;
alter table public.reps add column if not exists sustainability text;
