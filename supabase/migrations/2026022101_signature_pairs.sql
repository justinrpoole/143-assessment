-- Signature pairs: SHA-256 audit hashes proving inputs produced outputs
create table if not exists signature_pairs (
  id uuid default gen_random_uuid() primary key,
  assessment_run_id uuid not null references assessment_runs(id) on delete cascade,
  scorer_version text not null,
  input_hash text not null,
  output_hash text not null,
  created_at timestamptz default now() not null,
  unique (assessment_run_id, scorer_version)
);

create index if not exists idx_signature_pairs_run_id on signature_pairs(assessment_run_id);
