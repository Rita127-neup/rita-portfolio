-- The owner's admin could not save the About page, the voice note or the blog
-- switch: the database answered "permission denied for table site_settings".
-- This project grants UPDATE per column, and the columns added in
-- 20261116140000_about_blog_voice.sql had no grant.
--
-- site_settings.updated_at is deliberately NOT granted. A trigger keeps it
-- current, and admin code must never write it.
--
-- Already applied to production on 2026-11-16 as "admin_column_grants_about_blog";
-- this file keeps the repository in step with it.

grant update (about_paragraphs, languages, hobbies, pronunciation_audio_id, blog_enabled)
  on public.site_settings to authenticated;

-- blog_posts started with Supabase's broad default grants (anon could write and
-- truncate). Visitors may only read; row-level security still limits them to
-- published posts while the blog is switched on. The owner may add and delete
-- posts and edit the listed columns.
revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, delete on public.blog_posts to authenticated;
grant update (slug, title, excerpt, body, is_published, published_at, updated_at)
  on public.blog_posts to authenticated;
