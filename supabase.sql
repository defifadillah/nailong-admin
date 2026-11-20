-- Jalankan sekali di Supabase: SQL Editor > New query > paste > Run

create table if not exists public.records (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  store text not null,
  data jsonb not null default '{}'::jsonb,
  deleted boolean not null default false,
  synced_at timestamptz not null default now()
);

create index if not exists records_user_synced_idx on public.records (user_id, synced_at);

alter table public.records enable row level security;

drop policy if exists "own rows" on public.records;
create policy "own rows" on public.records
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.touch_synced_at() returns trigger
language plpgsql as $$
begin
  new.synced_at = now();
  return new;
end $$;

drop trigger if exists records_touch on public.records;
create trigger records_touch before insert or update on public.records
  for each row execute function public.touch_synced_at();
