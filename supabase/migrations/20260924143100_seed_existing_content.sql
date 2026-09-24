-- Seeds the CMS with the content the website currently shows, copied
-- verbatim from lib/content/*.ts. No new content is introduced here.
-- Experience, achievements, CV and media are intentionally left empty
-- because the site has none yet.

-- Site settings -------------------------------------------------------------

insert into public.site_settings
  (id, meta_title, meta_description, brand_mark, nav_cta_label, nav_cta_href, contact_email)
values (
  1,
  'Rita Neupane | Research & Computational Biology',
  'Rita Neupane''s portfolio featuring research, computational biology, public health, data science, and independent projects.',
  'RN',
  'Let''s connect',
  '/contact',
  'neupanereeta8@gmail.com'
);

insert into public.navigation_items (label, href, sort_order) values
  ('About',        '/about',        1),
  ('Research',     '/research',     2),
  ('Projects',     '/projects',     3),
  ('Publications', '/publications', 4),
  ('Contact',      '/contact',      5);

insert into public.social_links (label, url, sort_order) values
  ('GitHub',         'https://github.com/Rita127-neup', 1),
  ('LinkedIn',       null,                              2),
  ('Google Scholar', null,                              3);

-- Pages ---------------------------------------------------------------------
-- The home page header maps firstName -> title and lastName -> title_muted.

insert into public.pages (slug, eyebrow, title, title_muted, intro, is_published) values
  ('home',
   'Researcher · Computational Biology · Data',
   'Rita',
   'Neupane.',
   'I investigate biological and public-health questions through computation, data, and research.',
   true),
  ('about',
   'About',
   'Rita Neupane',
   null,
   'I am interested in the intersection of biology, computation, mathematics, and public health.',
   true),
  ('research',
   'Research',
   'Research',
   null,
   'My research uses computation, biological data, and statistical analysis to investigate questions in antimicrobial resistance and public health.',
   true),
  ('projects',
   'Projects',
   'Things I''ve built,',
   'studied, and explored.',
   'A collection of my research, computational projects, and data-driven work across biology, public health, and machine learning.',
   true),
  ('publications',
   'Publications',
   'Research in',
   'the public record.',
   'My published research has focused on public health, epidemiology, and data-driven investigation of health-related questions in Nepal.',
   true),
  ('contact',
   'Contact',
   'Let''s connect.',
   null,
   'I''m interested in research, computational biology, public health, data, and opportunities to learn and collaborate.',
   true);

insert into public.page_links (page_id, label, href, variant, sort_order)
select p.id, v.label, v.href, v.variant, v.sort_order
from public.pages p
join (values
  ('Explore my research', '/research', 'primary',   1),
  ('Get to know me',      '/about',    'secondary', 2)
) as v (label, href, variant, sort_order) on true
where p.slug = 'home';

-- Home "hero_photo": heading = placeholder initials, body = placeholder text.
-- image_id stays null until a photo is uploaded.
insert into public.page_sections (page_id, section_key, heading, body, button_label, sort_order)
select p.id, v.section_key, v.heading, v.body, v.button_label, v.sort_order
from public.pages p
join (values
  ('home', 'hero_photo', 'RN', 'Photograph coming soon', null, 1),
  ('publications', 'research_profile', 'Research profile',
   'Alongside these publications, I am currently developing a computational antimicrobial-resistance study using genomic data and machine learning.',
   null, 1),
  ('contact', 'email_card', 'Get in touch',
   'For research discussions, collaborations, or academic opportunities, feel free to reach out.',
   'Email me →', 1),
  ('contact', 'social_card', 'Find me online', null, null, 2)
) as v (page_slug, section_key, heading, body, button_label, sort_order)
  on v.page_slug = p.slug;

-- Research ------------------------------------------------------------------

insert into public.research_items (slug, category, title, summary, tags, sort_order, is_published) values
  ('ecoli-amr-generalization',
   'AMR / MACHINE LEARNING',
   'Geographic generalization and calibration of E. coli resistance prediction',
   'A computational study of genomic prediction for ciprofloxacin resistance in E. coli, examining how model discrimination and calibration change across geographic populations.',
   array['Antimicrobial resistance', 'Machine learning', 'Genomics'],
   1, true),
  ('dengue-nepal',
   'PUBLIC HEALTH',
   'Dengue Fever in Nepal',
   'Analysis of national dengue surveillance data from Nepal to investigate temporal patterns and relationships between dengue cases and environmental variables.',
   array['Epidemiology', 'Public health', 'Nepal'],
   2, true);

-- Projects ------------------------------------------------------------------

insert into public.projects (slug, category, title, description, tags, status, sort_order, is_published) values
  ('ecoli-amr',
   'COMPUTATIONAL BIOLOGY',
   'E. coli Antimicrobial Resistance',
   'A machine-learning study of genomic prediction for ciprofloxacin resistance in E. coli, focusing on geographic generalization, model calibration, and population shift.',
   array['AMR', 'Machine Learning', 'Genomics', 'Python'],
   'Research', 1, true),
  ('dengue-lens-nepal',
   'PUBLIC HEALTH',
   'Dengue Lens Nepal',
   'A public-data project exploring dengue surveillance in Nepal through data analysis, visualization, and accessible public-health information.',
   array['Dengue', 'Public Health', 'Data', 'Nepal'],
   'Independent Project', 2, true),
  ('dengue-fever-nepal',
   'EPIDEMIOLOGY',
   'Dengue Fever in Nepal',
   'An analysis of national dengue surveillance data from 2019–2024, investigating temporal patterns and relationships between dengue cases and environmental variables.',
   array['Epidemiology', 'Statistics', 'Public Health'],
   'Research', 3, true),
  ('caffeine-consumption',
   'HEALTH DATA',
   'Caffeine Consumption Study',
   'A community-based study examining caffeine consumption patterns, sources, motivations, and related behaviors among adults in Siddharthanagar, Nepal.',
   array['Survey Research', 'Statistics', 'Public Health'],
   'Published Research', 4, true),
  ('health-prediction-models',
   'MACHINE LEARNING',
   'Health Prediction Models',
   'Machine-learning projects exploring symptom-based disease prediction and mental-health prediction using structured health data.',
   array['Machine Learning', 'Python', 'Health Data'],
   'Independent Project', 5, true);

-- Publications --------------------------------------------------------------

insert into public.publications (slug, category, title, byline, summary, tags, status, sort_order, is_published) values
  ('caffeine-consumption-siddharthanagar',
   'Public Health',
   'Caffeine Consumption Patterns Among Adults in Siddharthanagar-09, Bhairahawa, Nepal',
   'First author · Community-based survey research',
   'A community-based study examining caffeine consumption patterns, sources, motivations, and related behaviors among adults in Siddharthanagar-09, Bhairahawa.',
   array['Survey Research', 'Public Health', 'Data Analysis', 'Nepal'],
   'Published', 1, true),
  ('dengue-fever-nepal',
   'Epidemiology',
   'Dengue Fever in Nepal: Temporal Patterns and Environmental Associations',
   'First author · National surveillance data analysis',
   'An analysis of national dengue surveillance data from Nepal covering 2019–2024, investigating temporal patterns and relationships between dengue cases and environmental variables.',
   array['Epidemiology', 'Dengue', 'Surveillance Data', 'Nepal'],
   'Published', 2, true);

insert into public.publication_links (publication_id, label, url, variant, sort_order)
select pub.id, v.label, v.url, v.variant, v.sort_order
from public.publications pub
join (values
  ('caffeine-consumption-siddharthanagar', 'View research record →',
   'https://doi.org/10.5281/zenodo.21785947', 'primary', 1),
  ('dengue-fever-nepal', 'View research record →',
   'https://doi.org/10.5281/zenodo.21773367', 'primary', 1),
  ('dengue-fever-nepal', 'Dataset / repository →',
   'https://doi.org/10.5281/zenodo.21773367', 'secondary', 2)
) as v (pub_slug, label, url, variant, sort_order)
  on v.pub_slug = pub.slug;
