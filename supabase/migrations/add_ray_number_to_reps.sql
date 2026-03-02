-- Add ray_number to reps for constellation clustering/coloring.
-- Safe to run multiple times.

alter table public.reps
  add column if not exists ray_number smallint;

alter table public.reps
  drop constraint if exists reps_ray_number_check;

alter table public.reps
  add constraint reps_ray_number_check
  check (ray_number is null or (ray_number between 1 and 9));

create index if not exists reps_user_ray_logged_at_idx
  on public.reps(user_id, ray_number, logged_at desc);
