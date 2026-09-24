@AGENTS.md
You are working directly inside my existing rita-portfolio project.

IMPORTANT: Do NOT modify, delete, rename, install, or overwrite anything yet.

First, inspect the existing project thoroughly.

Inspect:
- app/layout.tsx
- app/page.tsx
- app/globals.css
- app/about/page.tsx
- app/research/page.tsx
- app/projects/page.tsx
- app/publications/page.tsx
- app/contact/page.tsx
- package.json
- next.config.ts
- tsconfig.json
- eslint configuration
- public/
- any other existing files that affect the UI, routing, styling, or configuration

My current website was intentionally built with this visual identity and it MUST be preserved:

- Dark navy background
- Cyan accents
- Manrope font
- Clean, professional computational-biology/research aesthetic
- Rounded cards
- Subtle borders
- White/slate text
- Minimal gradients
- Minimal animation
- No flashy startup/crypto/gaming appearance
- Professional enough for college admissions officers and researchers/professionals
- Responsive design
- Existing page structure and content should be preserved unless changes are specifically required for the CMS

The existing pages are:
- /
- /about
- /research
- /projects
- /publications
- /contact

The site currently contains real information about me and my research. Do NOT invent publications, credentials, DOI numbers, awards, research results, affiliations, or other facts.

The long-term goal is to add:
1. A real owner/admin login
2. A real database-backed CMS
3. Secure authentication
4. Persistent photo/file storage
5. The ability for me to edit website text from the browser without touching code
6. The ability to upload/change photos
7. The ability to edit/add/delete/reorder projects
8. The ability to edit/add/delete/reorder publications
9. The ability to edit research information
10. The ability to edit experience and achievements
11. The ability to upload/replace my CV
12. The ability to edit social links and contact information
13. Netlify deployment
14. A production-ready setup

The preferred backend architecture is:
- Supabase Authentication
- Supabase PostgreSQL
- Supabase Storage
- Row Level Security
- Next.js App Router
- Netlify deployment

But do NOT implement anything yet.

For now, give me a concise inspection report with exactly these sections:

1. ALREADY IMPLEMENTED
What currently exists and works.

2. PRESERVE EXACTLY
What parts of the current UI, styling, content, routes, and structure should not be unnecessarily changed.

3. NEEDS TO CHANGE
What existing files/components need modification to support the CMS.

4. NEEDS TO BE ADDED
What new pages, components, database structures, authentication, storage, and configuration will be required.

5. RISKS / CONFLICTS
Identify anything that could break the current site, change its appearance, expose credentials, create security problems, or conflict with Netlify/Supabase.

Also tell me whether you recommend implementing the CMS incrementally rather than changing the whole website at once.

DO NOT modify any files.
DO NOT install packages.
DO NOT create Supabase tables.
DO NOT create an admin login yet.
DO NOT deploy anything.

After giving the inspection report, STOP and wait for my confirmation.