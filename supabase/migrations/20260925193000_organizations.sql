-- Organizations with optional logos managed from the admin dashboard.

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_id uuid references public.media_assets(id) on delete set null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizations enable row level security;

grant select on public.organizations to anon, authenticated;
grant insert, update, delete on public.organizations to authenticated;

create policy "Public can read visible organizations"
  on public.organizations for select to anon, authenticated using (is_visible);
create policy "Admins can insert organizations"
  on public.organizations for insert to authenticated with check ((select private.is_admin()));
create policy "Admins can update organizations"
  on public.organizations for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins can delete organizations"
  on public.organizations for delete to authenticated using ((select private.is_admin()));

drop policy if exists "Admins can upload portfolio files" on storage.objects;
create policy "Admins can upload portfolio files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-files'
    and (storage.foldername(name))[1] in ('cv', 'photos', 'logos')
    and (select private.is_admin())
  );

insert into public.organizations (name, sort_order, is_visible)
select v.name, v.sort_order, true
from (values
  ('ICAD', 0),
  ('Rotaract Club of Central Lumbini', 1),
  ('LSDT', 2),
  ('National Innovation Center', 3)
) v(name, sort_order)
where not exists (select 1 from public.organizations o where o.name=v.name);
