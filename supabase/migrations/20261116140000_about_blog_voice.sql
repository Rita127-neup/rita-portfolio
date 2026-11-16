-- Things the owner can now edit from the admin without touching code:
--   * the About paragraphs, languages and hobbies on the home page
--   * a voice recording of how her name is said
--   * a blog that stays hidden until she switches it on
-- All of it is additive; the public pages fall back to built-in text while the
-- new columns are empty.

alter table public.site_settings
  add column if not exists about_paragraphs text not null default '',
  add column if not exists languages text not null default '',
  add column if not exists hobbies text not null default '',
  add column if not exists pronunciation_audio_id uuid references public.media_assets(id) on delete set null,
  add column if not exists blog_enabled boolean not null default false;

-- One line per item, "Title | a few friendly words".
update public.site_settings
set languages = E'Nepali | my mother tongue\nEnglish | for school, research and writing\nHindi | another one I know\nJapanese | learning, just a little so far',
    hobbies = E'Makeup | colours, brushes and playing with looks\nHairstyles | styling hair for fun\nSewing | making things with needle and thread\nWatching Friends | my comfort show\nPlanting flowers | watching little gardens grow\nWriting my diary | the day, on paper\nExploring random things | on my laptop, all day long'
where id = 1 and languages = '' and hobbies = '';

-- Voice note: allow short audio files in their own folder of the existing bucket.
update storage.buckets
set allowed_mime_types = (
  select array(select distinct unnest(allowed_mime_types || array[
    'audio/mpeg','audio/mp4','audio/x-m4a','audio/m4a','audio/aac','audio/wav','audio/x-wav','audio/ogg','audio/webm'
  ]))
)
where id = 'portfolio-files';

drop policy if exists "Admins can upload portfolio files" on storage.objects;
create policy "Admins can upload portfolio files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-files'
    and (storage.foldername(name))[1] = any (array['cv','photos','logos','projects','audio'])
    and (select private.is_admin())
  );

-- Blog. Posts are never readable by visitors while blog_enabled is false.
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  title text not null check (char_length(title) between 1 and 200),
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  body text not null default '' check (char_length(body) <= 60000),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

create policy "Public can read published posts while the blog is on"
  on public.blog_posts for select to anon, authenticated
  using (is_published and coalesce((select s.blog_enabled from public.site_settings s where s.id = 1), false));
create policy "Admins can read all posts"
  on public.blog_posts for select to authenticated using ((select private.is_admin()));
create policy "Admins can insert posts"
  on public.blog_posts for insert to authenticated with check ((select private.is_admin()));
create policy "Admins can update posts"
  on public.blog_posts for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins can delete posts"
  on public.blog_posts for delete to authenticated using ((select private.is_admin()));
