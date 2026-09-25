-- Lets the site admin edit existing CMS content (first-version CMS).
--
-- Same two layers as the admin_update_projects migration:
--   * Column privileges: signed-in users may UPDATE only the content columns
--     listed below. Ids, slugs, foreign keys, created_at and updated_at stay
--     read-only through the API (updated_at is maintained by its trigger).
--     Page publish state, section/link visibility, section keys and link
--     variants on pages are left out on purpose: the public pages expect
--     those rows to exist and changing them would break or restyle a page.
--   * RLS: only admins (private.is_admin()) can read hidden rows or update
--     any row. Non-admin signed-in users keep the existing public read access
--     and cannot update anything.
-- No INSERT or DELETE access is granted here, and anon gains nothing.

-- Projects: allow reordering (the other columns were granted earlier).
grant update (sort_order) on table public.projects to authenticated;

-- Publications ---------------------------------------------------------------

grant update (category, title, byline, summary, tags, status, doi,
              published_on, sort_order, is_published)
  on table public.publications to authenticated;

create policy "Admins can read all publications"
  on public.publications for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update publications"
  on public.publications for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

grant update (label, url, variant, sort_order)
  on table public.publication_links to authenticated;

create policy "Admins can read all publication links"
  on public.publication_links for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update publication links"
  on public.publication_links for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Research -------------------------------------------------------------------

grant update (category, title, summary, tags, sort_order, is_published)
  on table public.research_items to authenticated;

create policy "Admins can read all research items"
  on public.research_items for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update research items"
  on public.research_items for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Experiences ----------------------------------------------------------------

grant update (role, organization, location, start_date, end_date, is_current,
              date_label, description, url, tags, sort_order, is_published)
  on table public.experiences to authenticated;

create policy "Admins can read all experiences"
  on public.experiences for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update experiences"
  on public.experiences for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Achievements ---------------------------------------------------------------

grant update (title, issuer, awarded_on, date_label, description, url,
              sort_order, is_published)
  on table public.achievements to authenticated;

create policy "Admins can read all achievements"
  on public.achievements for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update achievements"
  on public.achievements for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Site settings (single row, already publicly readable) ----------------------

grant update (meta_title, meta_description, brand_mark, nav_cta_label,
              nav_cta_href, contact_email)
  on table public.site_settings to authenticated;

create policy "Admins can update site settings"
  on public.site_settings for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Social links ---------------------------------------------------------------

grant update (label, url, sort_order, is_visible)
  on table public.social_links to authenticated;

create policy "Admins can read all social links"
  on public.social_links for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update social links"
  on public.social_links for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- Page text ------------------------------------------------------------------

grant update (eyebrow, title, title_muted, intro)
  on table public.pages to authenticated;

create policy "Admins can read all pages"
  on public.pages for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update pages"
  on public.pages for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

grant update (heading, body, button_label)
  on table public.page_sections to authenticated;

create policy "Admins can read all page sections"
  on public.page_sections for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update page sections"
  on public.page_sections for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

grant update (label, href)
  on table public.page_links to authenticated;

create policy "Admins can read all page links"
  on public.page_links for select to authenticated
  using ((select private.is_admin()));

create policy "Admins can update page links"
  on public.page_links for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
