create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(trim(nombre)) between 2 and 60),
  filial text check (filial is null or char_length(trim(filial)) between 1 and 80),
  comentario text not null check (char_length(trim(comentario)) between 10 and 600),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

alter table public.comments enable row level security;

revoke all on table public.comments from anon, authenticated;
grant select on table public.comments to anon;
grant insert (nombre, filial, comentario) on table public.comments to anon;

create policy "public can read approved comments"
on public.comments
for select
to anon
using (status = 'approved');

create policy "public can submit pending comments"
on public.comments
for insert
to anon
with check (status = 'pending' and approved_at is null);

create index comments_public_order_idx
on public.comments (approved_at desc)
where status = 'approved';

create index comments_moderation_queue_idx
on public.comments (status, created_at desc);

comment on table public.comments is
'Comentarios públicos moderados. El correo permanece únicamente en Netlify Forms.';
