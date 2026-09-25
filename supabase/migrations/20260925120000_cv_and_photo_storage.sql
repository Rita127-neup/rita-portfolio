-- Private file storage for the CV and the home page photo.
--
-- Storage
--   * One private bucket, "portfolio-files". It is never public: files are
--     served only through short-lived signed URLs.
--   * Objects live under two folders: cv/ (PDF) and photos/ (JPEG/PNG/WebP).
--   * Admins (private.is_admin()) may read, upload and delete objects in the
--     bucket. There is no UPDATE policy: a replacement is uploaded under a new
--     path and the old object is deleted.
--   * Everyone else may read (and so sign URLs for) only the objects that the
--     current CV / home photo points to: an object is readable only when a
--     public.media_assets row with is_public = true references it. Old,
--     replaced or unregistered files stay unreadable.
--
-- Database
--   * Admins may insert and delete media_assets and cv_documents rows, and set
--     the image of a page section (page_sections.image_id).
--   * The replace/remove steps run in the four functions below. They are
--     SECURITY INVOKER, so they run with the caller's privileges and RLS; they
--     only group the steps into one transaction and check admin status first.
--   * anon gains nothing except read access to the currently published files.

-- ---------------------------------------------------------------------------
-- Bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-files',
  'portfolio-files',
  false,
  10485760, -- 10 MB
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = false,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- Storage policies (storage.objects already has RLS enabled by Supabase)
-- ---------------------------------------------------------------------------

create policy "Public can read published portfolio files"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'portfolio-files'
    and exists (
      select 1 from public.media_assets m
      where m.bucket = 'portfolio-files'
        and m.object_path = storage.objects.name
        and m.is_public
    )
  );

create policy "Admins can read portfolio files"
  on storage.objects for select to authenticated
  using (bucket_id = 'portfolio-files' and (select private.is_admin()));

create policy "Admins can upload portfolio files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'portfolio-files'
    and (storage.foldername(name))[1] in ('cv', 'photos')
    and (select private.is_admin())
  );

create policy "Admins can delete portfolio files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-files' and (select private.is_admin()));

-- ---------------------------------------------------------------------------
-- media_assets
-- ---------------------------------------------------------------------------

grant insert (bucket, object_path, kind, mime_type, size_bytes, alt_text,
              is_public, uploaded_by)
  on table public.media_assets to authenticated;
grant delete on table public.media_assets to authenticated;

create policy "Admins can read all media"
  on public.media_assets for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can add media"
  on public.media_assets for insert to authenticated
  with check (bucket = 'portfolio-files' and (select private.is_admin()));

create policy "Admins can delete media"
  on public.media_assets for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- cv_documents
-- ---------------------------------------------------------------------------

grant insert (media_id, title, version_label, is_current, is_published)
  on table public.cv_documents to authenticated;
grant delete on table public.cv_documents to authenticated;

create policy "Admins can read all CV documents"
  on public.cv_documents for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can add CV documents"
  on public.cv_documents for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins can delete CV documents"
  on public.cv_documents for delete to authenticated
  using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- page_sections: let admins attach an image (the existing "Admins can update
-- page sections" policy already limits updates to admins).
-- ---------------------------------------------------------------------------

grant update (image_id) on table public.page_sections to authenticated;

-- ---------------------------------------------------------------------------
-- Functions (SECURITY INVOKER: RLS and privileges above still apply)
-- ---------------------------------------------------------------------------

-- Makes the uploaded PDF the current, published CV. Removes the previous CV
-- rows and returns their object paths so the caller can delete the files.
create function public.replace_current_cv(
  p_object_path text,
  p_mime_type   text,
  p_size_bytes  bigint,
  p_title       text
)
returns text[]
language plpgsql
security invoker
set search_path = ''
as $$
declare
  old_media_ids uuid[];
  old_paths     text[];
  new_media_id  uuid;
begin
  if not (select private.is_admin()) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if p_object_path !~ '^cv/[0-9a-f-]{36}\.pdf$' or p_mime_type <> 'application/pdf' then
    raise exception 'invalid CV file' using errcode = '22023';
  end if;
  if p_title is null or length(btrim(p_title)) = 0 or length(p_title) > 100 then
    raise exception 'invalid CV title' using errcode = '22023';
  end if;

  select coalesce(array_agg(media_id), '{}') into old_media_ids
    from public.cv_documents;
  delete from public.cv_documents where true;

  with removed as (
    delete from public.media_assets
    where id = any (old_media_ids)
    returning object_path
  )
  select coalesce(array_agg(object_path), '{}') into old_paths from removed;

  insert into public.media_assets
    (bucket, object_path, kind, mime_type, size_bytes, is_public, uploaded_by)
  values
    ('portfolio-files', p_object_path, 'document', p_mime_type, p_size_bytes,
     true, (select auth.uid()))
  returning id into new_media_id;

  insert into public.cv_documents (media_id, title, is_current, is_published)
  values (new_media_id, btrim(p_title), true, true);

  return old_paths;
end;
$$;

-- Removes the CV from the site. Returns the object paths to delete.
create function public.remove_current_cv()
returns text[]
language plpgsql
security invoker
set search_path = ''
as $$
declare
  old_media_ids uuid[];
  old_paths     text[];
begin
  if not (select private.is_admin()) then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select coalesce(array_agg(media_id), '{}') into old_media_ids
    from public.cv_documents;
  delete from public.cv_documents where true;

  with removed as (
    delete from public.media_assets
    where id = any (old_media_ids)
    returning object_path
  )
  select coalesce(array_agg(object_path), '{}') into old_paths from removed;

  return old_paths;
end;
$$;

-- Makes the uploaded image the home page photo (the "hero_photo" section of
-- the "home" page). Returns the previous photo's object path, if any.
create function public.replace_hero_photo(
  p_object_path text,
  p_mime_type   text,
  p_size_bytes  bigint,
  p_alt_text    text
)
returns text[]
language plpgsql
security invoker
set search_path = ''
as $$
declare
  section_id   uuid;
  old_media_id uuid;
  old_paths    text[];
  new_media_id uuid;
begin
  if not (select private.is_admin()) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if p_object_path !~ '^photos/[0-9a-f-]{36}\.(jpg|png|webp)$'
     or p_mime_type not in ('image/jpeg', 'image/png', 'image/webp') then
    raise exception 'invalid photo file' using errcode = '22023';
  end if;
  if p_alt_text is null or length(btrim(p_alt_text)) = 0 or length(p_alt_text) > 200 then
    raise exception 'invalid alt text' using errcode = '22023';
  end if;

  select s.id, s.image_id into section_id, old_media_id
    from public.page_sections s
    join public.pages p on p.id = s.page_id
   where p.slug = 'home' and s.section_key = 'hero_photo';
  if section_id is null then
    raise exception 'home photo section not found' using errcode = 'P0002';
  end if;

  insert into public.media_assets
    (bucket, object_path, kind, mime_type, size_bytes, alt_text, is_public,
     uploaded_by)
  values
    ('portfolio-files', p_object_path, 'image', p_mime_type, p_size_bytes,
     btrim(p_alt_text), true, (select auth.uid()))
  returning id into new_media_id;

  update public.page_sections set image_id = new_media_id where id = section_id;
  if not found then
    raise exception 'could not update the home photo section' using errcode = '42501';
  end if;

  with removed as (
    delete from public.media_assets
    where id = old_media_id
    returning object_path
  )
  select coalesce(array_agg(object_path), '{}') into old_paths from removed;

  return old_paths;
end;
$$;

-- Removes the home page photo; the hero shows the initials placeholder again.
create function public.remove_hero_photo()
returns text[]
language plpgsql
security invoker
set search_path = ''
as $$
declare
  section_id   uuid;
  old_media_id uuid;
  old_paths    text[];
begin
  if not (select private.is_admin()) then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select s.id, s.image_id into section_id, old_media_id
    from public.page_sections s
    join public.pages p on p.id = s.page_id
   where p.slug = 'home' and s.section_key = 'hero_photo';
  if section_id is null or old_media_id is null then
    return '{}';
  end if;

  update public.page_sections set image_id = null where id = section_id;
  if not found then
    raise exception 'could not update the home photo section' using errcode = '42501';
  end if;

  with removed as (
    delete from public.media_assets
    where id = old_media_id
    returning object_path
  )
  select coalesce(array_agg(object_path), '{}') into old_paths from removed;

  return old_paths;
end;
$$;

-- Supabase grants execute on new public functions to anon by default.
revoke all on function public.replace_current_cv(text, text, bigint, text) from public, anon, authenticated;
revoke all on function public.remove_current_cv() from public, anon, authenticated;
revoke all on function public.replace_hero_photo(text, text, bigint, text) from public, anon, authenticated;
revoke all on function public.remove_hero_photo() from public, anon, authenticated;
grant execute on function public.replace_current_cv(text, text, bigint, text) to authenticated;
grant execute on function public.remove_current_cv() to authenticated;
grant execute on function public.replace_hero_photo(text, text, bigint, text) to authenticated;
grant execute on function public.remove_hero_photo() to authenticated;
