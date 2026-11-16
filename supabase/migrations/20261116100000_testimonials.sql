-- Testimonials managed from /admin/testimonials: a name, a role, the words the
-- person sent (a paragraph or a full letter) and an optional photo. The photo
-- is an ordinary public image in the portfolio-files bucket (photos/ folder),
-- linked through media_assets exactly like organization logos.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  role text not null default '' check (char_length(role) <= 200),
  quote text not null default '' check (char_length(quote) <= 8000),
  image_id uuid references public.media_assets(id) on delete set null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;

create policy "Public can read visible testimonials"
  on public.testimonials for select to anon, authenticated using (is_visible);
create policy "Admins can read all testimonials"
  on public.testimonials for select to authenticated using ((select private.is_admin()));
create policy "Admins can insert testimonials"
  on public.testimonials for insert to authenticated with check ((select private.is_admin()));
create policy "Admins can update testimonials"
  on public.testimonials for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins can delete testimonials"
  on public.testimonials for delete to authenticated using ((select private.is_admin()));

-- Placeholders for the two people who have agreed to write one. Entries with
-- no text are not shown on the public site until the words are added.
insert into public.testimonials (name, role, sort_order)
select v.name, v.role, v.sort_order
from (values
  ('Bijay Pandey', 'Founder, LSDT', 0),
  ('Mahabir Pun', 'Minister for Science, Technology and Innovation', 1)
) v(name, role, sort_order)
where not exists (select 1 from public.testimonials t where t.name = v.name);
