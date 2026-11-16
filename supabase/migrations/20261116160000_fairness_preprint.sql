-- One publications row feeds both the Research and the Publications pages.
-- The long write-up and the status line live in lib/content/copy.ts under the same slug.
-- Already applied to production on 2026-11-16 as "fairness_preprint".
insert into public.publications (slug, category, title, byline, summary, tags, status, sort_order, is_published)
select
  'group-fairness-recourse-fairness',
  'Algorithmic Fairness',
  'Does Group Fairness Guarantee Recourse Fairness? An Empirical Test Across Two Decision Domains',
  'Third author · Algorithmic fairness research',
  'Tests whether methods that equalise outcomes across groups also leave denied people at an equal distance from approval, using two public datasets and 30 random train/test splits.',
  array['Algorithmic Fairness', 'Algorithmic Recourse', 'Machine Learning'],
  'Preprint on Preprints.org · not peer reviewed',
  4,
  true
where not exists (select 1 from public.publications where slug = 'group-fairness-recourse-fairness');

insert into public.publication_links (publication_id, label, url, variant, sort_order)
select p.id, 'Read preprint', 'https://www.preprints.org/manuscript/202611.0608', 'primary', 1
from public.publications p
where p.slug = 'group-fairness-recourse-fairness'
  and not exists (select 1 from public.publication_links l where l.publication_id = p.id);
