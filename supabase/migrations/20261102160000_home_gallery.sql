-- Additional homepage photos managed from /admin/gallery.
-- The production table may already exist from the earlier gallery migration.
create table if not exists public.home_gallery_images (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null unique references public.media_assets (id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists home_gallery_images_sort_idx on public.home_gallery_images (sort_order, created_at);
alter table public.home_gallery_images enable row level security;
revoke all on table public.home_gallery_images from anon, authenticated;
grant select on table public.home_gallery_images to anon, authenticated;
grant insert, delete on table public.home_gallery_images to authenticated;
drop policy if exists "Public can read gallery images with public media" on public.home_gallery_images;
create policy "Public can read gallery images with public media"
  on public.home_gallery_images for select to anon, authenticated
  using (exists (select 1 from public.media_assets m where m.id = home_gallery_images.media_id and m.is_public));
drop policy if exists "Admins can add home gallery images" on public.home_gallery_images;
create policy "Admins can add home gallery images"
  on public.home_gallery_images for insert to authenticated
  with check ((select private.is_admin()) and exists (
    select 1 from public.media_assets m
    where m.id = home_gallery_images.media_id and m.is_public and m.kind = 'image'
  ));
drop policy if exists "Admins can remove home gallery images" on public.home_gallery_images;
create policy "Admins can remove home gallery images"
  on public.home_gallery_images for delete to authenticated
  using ((select private.is_admin()));
