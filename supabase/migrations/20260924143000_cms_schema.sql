-- CMS schema for rita-portfolio.
--
-- Security model
--   * Every CMS table has Row Level Security enabled.
--   * Public visitors (anon) and signed-in users can only SELECT rows that are
--     explicitly published/visible. No INSERT/UPDATE/DELETE policies exist yet,
--     so nothing can be written through the public API.
--   * Owner/admin writes will be added in a later migration, gated on
--     private.is_admin(). The admin list lives in the non-exposed "private"
--     schema and starts empty; nobody is an admin until a row is inserted
--     manually (SQL editor / service role).
--   * Binary files (photos, CV) live in Supabase Storage. Tables below only
--     store the bucket + object path and metadata.

-- ---------------------------------------------------------------------------
-- Private schema: admin list and helper functions (not exposed via the API)
-- ---------------------------------------------------------------------------

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table private.admin_users enable row level security;
revoke all on table private.admin_users from public, anon, authenticated;

-- True when the current authenticated user is listed in private.admin_users.
-- Security definer so it can read the admin list without exposing it.
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Media (Storage object references only — no binary data)
-- ---------------------------------------------------------------------------

create table public.media_assets (
  id           uuid primary key default gen_random_uuid(),
  bucket       text not null,
  object_path  text not null,
  kind         text not null default 'image'
               check (kind in ('image', 'document', 'other')),
  mime_type    text,
  size_bytes   bigint check (size_bytes is null or size_bytes >= 0),
  width        integer check (width is null or width > 0),
  height       integer check (height is null or height > 0),
  alt_text     text,
  is_public    boolean not null default false,
  uploaded_by  uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (bucket, object_path)
);

-- ---------------------------------------------------------------------------
-- Site settings and navigation
-- ---------------------------------------------------------------------------

-- Single-row table (id is always 1).
create table public.site_settings (
  id               smallint primary key default 1 check (id = 1),
  meta_title       text not null,
  meta_description text not null,
  brand_mark       text not null,
  nav_cta_label    text not null,
  nav_cta_href     text not null check (nav_cta_href ~ '^(/|https?://|mailto:)'),
  contact_email    text check (contact_email is null or contact_email ~ '^[^@\s]+@[^@\s]+$'),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table public.navigation_items (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  href       text not null unique check (href ~ '^(/|https?://|mailto:)'),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.social_links (
  id         uuid primary key default gen_random_uuid(),
  label      text not null unique,
  -- Null until a real URL is supplied; the UI shows "coming soon".
  url        text check (url is null or url ~ '^https?://'),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Page content
-- ---------------------------------------------------------------------------

-- One row per route. Holds the shared page header fields.
create table public.pages (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique
                   check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  eyebrow          text not null default '',
  title            text not null,
  -- Optional second line of the title, rendered in muted slate.
  title_muted      text,
  intro            text not null default '',
  meta_title       text,
  meta_description text,
  is_published     boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Named content blocks within a page (e.g. contact "email card").
create table public.page_sections (
  id           uuid primary key default gen_random_uuid(),
  page_id      uuid not null references public.pages (id) on delete cascade,
  section_key  text not null check (section_key ~ '^[a-z0-9]+(_[a-z0-9]+)*$'),
  heading      text,
  body         text,
  button_label text,
  image_id     uuid references public.media_assets (id) on delete set null,
  sort_order   integer not null default 0,
  is_visible   boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (page_id, section_key)
);

-- Call-to-action buttons on a page.
create table public.page_links (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.pages (id) on delete cascade,
  label      text not null,
  href       text not null check (href ~ '^(/|https?://|mailto:)'),
  variant    text not null default 'primary'
             check (variant in ('primary', 'secondary')),
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Research, projects, publications
-- ---------------------------------------------------------------------------

create table public.research_items (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique
               check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category     text not null,
  title        text not null,
  summary      text not null,
  tags         text[] not null default '{}',
  image_id     uuid references public.media_assets (id) on delete set null,
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique
               check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category     text not null,
  title        text not null,
  description  text not null,
  tags         text[] not null default '{}',
  status       text not null,
  link_url     text check (link_url is null or link_url ~ '^https?://'),
  image_id     uuid references public.media_assets (id) on delete set null,
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.publications (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique
               check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category     text not null,
  title        text not null,
  byline       text not null default '',
  summary      text not null,
  tags         text[] not null default '{}',
  status       text not null,
  doi          text,
  published_on date,
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.publication_links (
  id             uuid primary key default gen_random_uuid(),
  publication_id uuid not null references public.publications (id) on delete cascade,
  label          text not null,
  url            text not null check (url ~ '^https?://'),
  variant        text not null default 'primary'
                 check (variant in ('primary', 'secondary')),
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Experience, achievements, CV
-- ---------------------------------------------------------------------------

create table public.experiences (
  id           uuid primary key default gen_random_uuid(),
  role         text not null,
  organization text not null,
  location     text,
  start_date   date,
  end_date     date,
  is_current   boolean not null default false,
  -- Free-text override for display, e.g. "Summer 2025".
  date_label   text,
  description  text,
  url          text check (url is null or url ~ '^https?://'),
  tags         text[] not null default '{}',
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table public.achievements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  issuer       text,
  awarded_on   date,
  date_label   text,
  description  text,
  url          text check (url is null or url ~ '^https?://'),
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.cv_documents (
  id            uuid primary key default gen_random_uuid(),
  media_id      uuid not null references public.media_assets (id) on delete restrict,
  title         text not null default 'CV',
  version_label text,
  is_current    boolean not null default false,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- At most one current CV.
create unique index cv_documents_one_current
  on public.cv_documents (is_current) where is_current;

-- ---------------------------------------------------------------------------
-- Indexes for foreign keys and ordered reads
-- ---------------------------------------------------------------------------

create index page_sections_page_id_idx      on public.page_sections (page_id, sort_order);
create index page_sections_image_id_idx     on public.page_sections (image_id);
create index page_links_page_id_idx         on public.page_links (page_id, sort_order);
create index research_items_sort_idx        on public.research_items (sort_order);
create index research_items_image_id_idx    on public.research_items (image_id);
create index projects_sort_idx              on public.projects (sort_order);
create index projects_image_id_idx          on public.projects (image_id);
create index publications_sort_idx          on public.publications (sort_order);
create index publication_links_pub_id_idx   on public.publication_links (publication_id, sort_order);
create index experiences_sort_idx           on public.experiences (sort_order);
create index achievements_sort_idx          on public.achievements (sort_order);
create index navigation_items_sort_idx      on public.navigation_items (sort_order);
create index social_links_sort_idx          on public.social_links (sort_order);
create index cv_documents_media_id_idx      on public.cv_documents (media_id);
create index media_assets_uploaded_by_idx   on public.media_assets (uploaded_by);

-- ---------------------------------------------------------------------------
-- updated_at triggers, RLS, and grants for every CMS table
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'media_assets', 'site_settings', 'navigation_items', 'social_links',
    'pages', 'page_sections', 'page_links',
    'research_items', 'projects', 'publications', 'publication_links',
    'experiences', 'achievements', 'cv_documents'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function private.set_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    -- Defense in depth: the public API roles get read access only.
    -- Owner writes will be granted to "authenticated" with admin-only
    -- policies in a later migration.
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to anon, authenticated', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Public read policies (published / visible content only)
-- ---------------------------------------------------------------------------

create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated
  using (true);

create policy "Public can read visible navigation items"
  on public.navigation_items for select to anon, authenticated
  using (is_visible);

create policy "Public can read visible social links"
  on public.social_links for select to anon, authenticated
  using (is_visible);

create policy "Public can read public media"
  on public.media_assets for select to anon, authenticated
  using (is_public);

create policy "Public can read published pages"
  on public.pages for select to anon, authenticated
  using (is_published);

create policy "Public can read visible sections of published pages"
  on public.page_sections for select to anon, authenticated
  using (
    is_visible
    and exists (
      select 1 from public.pages p
      where p.id = page_sections.page_id and p.is_published
    )
  );

create policy "Public can read visible links of published pages"
  on public.page_links for select to anon, authenticated
  using (
    is_visible
    and exists (
      select 1 from public.pages p
      where p.id = page_links.page_id and p.is_published
    )
  );

create policy "Public can read published research items"
  on public.research_items for select to anon, authenticated
  using (is_published);

create policy "Public can read published projects"
  on public.projects for select to anon, authenticated
  using (is_published);

create policy "Public can read published publications"
  on public.publications for select to anon, authenticated
  using (is_published);

create policy "Public can read links of published publications"
  on public.publication_links for select to anon, authenticated
  using (
    exists (
      select 1 from public.publications pub
      where pub.id = publication_links.publication_id and pub.is_published
    )
  );

create policy "Public can read published experiences"
  on public.experiences for select to anon, authenticated
  using (is_published);

create policy "Public can read published achievements"
  on public.achievements for select to anon, authenticated
  using (is_published);

create policy "Public can read published CV documents"
  on public.cv_documents for select to anon, authenticated
  using (is_published);
