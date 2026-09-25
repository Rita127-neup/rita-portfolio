-- Complete first-version CMS CRUD permissions for portfolio records.
-- Admins are the only authenticated users allowed to insert or delete these rows.

do $$
begin
  grant insert, delete on table public.projects to authenticated;
  grant insert, delete on table public.publications to authenticated;
  grant insert, delete on table public.research_items to authenticated;
  grant insert, delete on table public.experiences to authenticated;
  grant insert, delete on table public.achievements to authenticated;
  grant insert, delete on table public.publication_links to authenticated;
exception
  when undefined_table then null;
end $$;

create policy "Admins can insert projects"
  on public.projects for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins can delete projects"
  on public.projects for delete to authenticated
  using ((select private.is_admin()));

create policy "Admins can insert publications"
  on public.publications for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins can delete publications"
  on public.publications for delete to authenticated
  using ((select private.is_admin()));

create policy "Admins can insert research items"
  on public.research_items for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins can delete research items"
  on public.research_items for delete to authenticated
  using ((select private.is_admin()));

create policy "Admins can insert experiences"
  on public.experiences for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins can delete experiences"
  on public.experiences for delete to authenticated
  using ((select private.is_admin()));

create policy "Admins can insert achievements"
  on public.achievements for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins can delete achievements"
  on public.achievements for delete to authenticated
  using ((select private.is_admin()));

create policy "Admins can insert publication links"
  on public.publication_links for insert to authenticated
  with check ((select private.is_admin()));

create policy "Admins can delete publication links"
  on public.publication_links for delete to authenticated
  using ((select private.is_admin()));
