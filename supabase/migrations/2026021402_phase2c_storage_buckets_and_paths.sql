-- Phase 2C: storage buckets for reports/sharecards and PDF report tracking support

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'reports',
    'reports',
    false,
    52428800,
    array[
      'application/pdf',
      'text/html'
    ]::text[]
  ),
  (
    'sharecards',
    'sharecards',
    false,
    10485760,
    array[
      'image/png',
      'image/svg+xml'
    ]::text[]
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
alter table assessment_reports
  drop constraint if exists assessment_reports_run_id_key;
alter table assessment_reports
  add constraint assessment_reports_run_id_format_key unique (run_id, format);
