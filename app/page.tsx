import Image from "next/image";
import Link from "next/link";
import { HomePhotoGallery } from "@/app/_components/home-photo-gallery";
import { HomeGalleryWall } from "@/app/_components/home-gallery-wall";
import { SectionShell } from "@/app/_components/section-shell";
import { WorkMark } from "@/app/_components/work-mark";
import {
  getAboutContent,
  getContactContent,
  getHomeContent,
  getOrganizations,
  getProfileInfo,
  getProjectsContent,
  getHomeGallery,
  getPublicationsContent,
  getSiteSettings,
} from "@/lib/content";

export default async function Home() {
  const [home, profile, organizations, projects, publications, about, site, gallery, contact] = await Promise.all([
    getHomeContent(),
    getProfileInfo(),
    getOrganizations(),
    getProjectsContent(),
    getPublicationsContent(),
    getAboutContent(),
    getSiteSettings(),
    getHomeGallery(),
    getContactContent(),
  ]);

  const featuredProjects = projects.items.filter((project) => ["dengue-lens-nepal", "nepal-education-data-engine"].includes(project.id)).slice(0, 3);
  const featuredPublications = publications.items.slice(0, 3);
  const socialLinks = site.socialLinks.filter((link) => link.url);
  const email = site.contactEmail || profile.email;

  const organizationPriority = [
    "National Innovation Center",
    "ICAD",
    "Rotaract Club of Central Lumbini",
    "LSDT",
  ];
  const orderedOrganizations = [...organizations].sort((a, b) => {
    const ai = organizationPriority.indexOf(a.name);
    const bi = organizationPriority.indexOf(b.name);
    if (ai === -1 && bi === -1) return a.sortOrder - b.sortOrder;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  // Sections are numbered in the order they appear, skipping any that are empty.
  const sectionKeys = [
    "about",
    featuredPublications.length > 0 ? "research" : "",
    featuredProjects.length > 0 ? "projects" : "",
    about.education.length > 0 ? "education" : "",
    gallery.length > 0 ? "journal" : "",
    "contact",
  ].filter(Boolean);
  const num = (key: string) => String(sectionKeys.indexOf(key) + 1).padStart(2, "0");

  return (
    <main className="site-shell">
      <section id="home" className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-14 pt-12 md:grid-cols-[1.15fr_0.85fr] md:pb-20 md:pt-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b83a74]">{home.eyebrow}</p>
          <h1 className="mt-5 font-display text-[3.4rem] font-semibold leading-[0.98] tracking-[-0.04em] text-[#5b2c43] sm:text-[4.6rem] md:text-[5.2rem] lg:text-[6rem]">
            {home.firstName}
            {home.lastName ? (
              <>
                <br />
                <span className="text-[#8a5a72]">{home.lastName}</span>
              </>
            ) : null}
            <span className="text-[#e0679a]">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#74455b] md:text-lg md:leading-8">{home.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            <Link
              href={home.primaryCta.href}
              className="rounded-full bg-[#b83a74] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(184,58,116,0.25)] transition hover:bg-[#8f2a5a]"
            >
              {home.primaryCta.label} →
            </Link>
            <Link
              href={home.secondaryCta.href}
              className="rounded-full border border-[#b83a74]/40 bg-[#fff8fb] px-6 py-3 text-sm font-semibold text-[#b83a74] transition hover:border-[#b83a74]"
            >
              {home.secondaryCta.label} →
            </Link>
            {home.cv && (
              <a
                href={home.cv.href}
                className="text-sm font-semibold text-[#5b2c43] underline decoration-[#b83a74]/30 underline-offset-8 hover:decoration-[#b83a74]"
              >
                {home.cv.label} →
              </a>
            )}
          </div>
          {socialLinks.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#f2c3d5] bg-[#fff8fb] px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#b83a74] transition hover:bg-[#fde6ee]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="relative mx-auto w-full max-w-md md:justify-self-end">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#e8a3bf" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute -left-5 -top-5 z-10 h-11 w-11 -rotate-12"><path d="M12 21s-7-4.6-9.2-9.1C1.3 8.6 3.2 5 6.6 5c2 0 3.7 1.2 4.9 3 1.2-1.8 2.9-3 4.9-3 3.4 0 5.3 3.6 3.8 6.9C19 16.4 12 21 12 21z" fill="#fde6ee" /></svg>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#e8a3bf" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute -bottom-4 -right-3 z-10 h-10 w-10 rotate-12"><path d="M12 3l2.2 5.6 5.8.5-4.4 3.8 1.4 5.8L12 15.6 7 18.7l1.4-5.8L4 9.1l5.8-.5z" fill="#fde6ee" /></svg>
          <HomePhotoGallery
            photoUrl={home.photoUrl}
            photoAlt={home.photoAlt}
            placeholderInitials={home.photoPlaceholderInitials}
            birthday={profile.birthday}
            photos={[]}
          />
        </div>
      </section>

      {orderedOrganizations.length > 0 && (
        <section aria-label="Organizations and communities" className="border-t border-[#f2c3d5] bg-[#fff8fb]/70">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:gap-8">
            <p className="shrink-0 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#b83a74]">Organizations &amp; communities</p>
            <div className="flex flex-nowrap items-center gap-x-6 overflow-x-auto pb-1">
              {orderedOrganizations.map((organization) => (
                <div key={organization.id} className="flex shrink-0 items-center gap-2.5">
                  <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-[#ecb5cb] bg-white ${/lsdt|icad|innovation/i.test(organization.name) ? "h-12 w-[4.5rem] rounded-md" : "h-12 w-12 rounded-full"}`}>
                    {organization.logoId ? <Image src={`/media/organization/${organization.id}?v=${organization.logoId}`} alt={organization.name} width={72} height={48} unoptimized className="h-full w-full object-contain" /> : <span className="text-xs font-bold text-[#a8336b]">{organization.name.slice(0, 2).toUpperCase()}</span>}
                  </div>
                  <span className="text-sm font-bold text-[#5b2c43]">{organization.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <SectionShell id="about" number={num("about")} title="About me" href="/about" linkLabel="Read more →">
        <p className="line-clamp-6 max-w-3xl font-display text-xl leading-9 text-[#5b2c43] md:text-2xl md:leading-10">{about.body}</p>
      </SectionShell>

      {featuredPublications.length > 0 && (
        <SectionShell id="research" number={num("research")} title="Research" href="/research" linkLabel="See all →">
          <div className="space-y-5">
            {featuredPublications.map((publication) => {
              const firstLink = publication.links.find((link) => link.url);
              return (
                <article key={publication.id} className="rounded-2xl border border-[#f2c3d5] bg-[#fff8fb]/90 p-6 shadow-[0_6px_20px_rgba(184,58,116,0.06)]">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#8a5a72]">{publication.category} · {publication.byline}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <WorkMark kind={publication.id.includes("amr") ? "genomics" : publication.id.includes("dengue") ? "epidemiology" : "survey"} />
                    <h3 className="font-display text-xl leading-snug text-[#5b2c43]">
                      {firstLink ? <a href={firstLink.url} target="_blank" rel="noreferrer" className="hover:text-[#b83a74]">{publication.title} ↗</a> : publication.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#74455b]">{publication.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#f6d3e1] pt-4">
                    <span className="text-xs text-[#8a5a72]">{publication.status}</span>
                    {publication.links.filter((link) => link.url).slice(0, 2).map((link) => (
                      <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#b83a74] hover:text-[#8f2a5a]">{link.label} ↗</a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </SectionShell>
      )}

      {featuredProjects.length > 0 && (
        <SectionShell id="projects" number={num("projects")} title="Projects" href="/projects" linkLabel="See all →">
          <div className="space-y-5">
            {featuredProjects.map((project) => (
              <article key={project.id} className="rounded-2xl border border-[#f2c3d5] bg-[#fff8fb]/90 p-6 shadow-[0_6px_20px_rgba(184,58,116,0.06)]">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#b83a74]">{project.category} · {project.status}</p>
                <div className="mt-3 flex items-center gap-3">
                  <WorkMark kind={project.id === "dengue-lens-nepal" ? "web" : "data"} />
                  <h3 className="font-display text-2xl leading-tight text-[#5b2c43]">{project.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#74455b]">{project.description}</p>
                {(project.linkUrl || project.githubUrl) && (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#f6d3e1] pt-4">
                    {project.linkUrl && <a href={project.linkUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#b83a74] hover:text-[#8f2a5a]">Open live project ↗</a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#5b2c43] hover:text-[#b83a74]">Source code ↗</a>}
                  </div>
                )}
              </article>
            ))}
          </div>
        </SectionShell>
      )}

      {about.education.length > 0 && (
        <SectionShell id="education" number={num("education")} title="Education">
          <ol className="space-y-6">
            {about.education.map((item) => (
              <li key={item.school} className="grid gap-1 border-b border-[#f6d3e1] pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#b83a74]">{item.years}</p>
                <div>
                  <p className="font-display text-xl leading-tight text-[#5b2c43]">{item.school}</p>
                  <p className="mt-1 text-sm text-[#8a5a72]">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionShell>
      )}

      <HomeGalleryWall photos={gallery} number={num("journal")} />

      <SectionShell id="contact" number={num("contact")} title="Get in touch" href="/contact" linkLabel="Contact page →">
        <p className="max-w-xl text-lg leading-8 text-[#74455b]">{contact.intro}</p>
        {email && (
          <a
            href={`mailto:${email}`}
            className="mt-6 inline-block break-all font-display text-2xl font-semibold text-[#b83a74] underline decoration-[#e8a3bf] decoration-2 underline-offset-8 transition hover:text-[#8f2a5a] md:text-4xl"
          >
            {email}
          </a>
        )}
        {profile.location && <p className="mt-4 text-sm text-[#8a5a72]">{profile.location}</p>}
        {socialLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#f2c3d5] bg-[#fff8fb] px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#b83a74] transition hover:bg-[#fde6ee]"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </SectionShell>
    </main>
  );
}
