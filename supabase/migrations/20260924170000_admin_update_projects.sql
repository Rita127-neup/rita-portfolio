-- Lets the site admin edit existing projects from the CMS.
--
-- Two layers:
--   * Column privileges: signed-in users may UPDATE only the content columns
--     below. id, slug, image_id, sort_order, created_at and updated_at stay
--     read-only through the API (updated_at is still maintained by the
--     set_updated_at trigger).
--   * RLS: only admins (private.is_admin()) can read hidden projects or
--     update any project. Non-admin signed-in users keep the existing
--     published-only read access and cannot update anything.
-- No INSERT or DELETE access is granted here, and anon gains nothing.

grant update (title, category, description, status, tags, link_url, is_published)
  on table public.projects to authenticated;

create policy "Admins can read all projects"
  on public.projects for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update projects"
  on public.projects for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
