-- Exposes the admin check to the Data API without exposing the admin list.
--
-- The "private" schema is not exposed by the API, so application code cannot
-- call private.is_admin() directly. This wrapper returns only a boolean for
-- the calling user (auth.uid() inside private.is_admin()); it takes no
-- arguments, so it cannot be used to ask about any other user.
-- private.admin_users stays unreachable through the API.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin();
$$;

-- Supabase grants execute on new public functions to anon and authenticated
-- by default, so revoke explicitly and grant back to signed-in users only.
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;
