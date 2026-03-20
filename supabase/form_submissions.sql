create table if not exists public.form_submissions (
  id bigint generated always as identity primary key,
  nome text not null,
  whatsapp text not null,
  email text not null,
  ja_treina text not null,
  conhece_ntt text not null,
  conheceu_por_onde text,
  melhor_horario text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.form_submissions enable row level security;

drop policy if exists "Allow anonymous inserts" on public.form_submissions;
create policy "Allow anonymous inserts"
on public.form_submissions
for insert
to anon
with check (true);
