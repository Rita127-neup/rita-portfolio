import Image from "next/image";
import Link from "next/link";
import { HomePhotoGallery } from "@/app/_components/home-photo-gallery";
import { HomeGalleryWall } from "@/app/_components/home-gallery-wall";
import { WorkMark } from "@/app/_components/work-mark";
import {
  getAboutContent,
  getHomeContent,
  getOrganizations,
  getProfileInfo,
  getProjectsContent,
  getHomeGallery,
  getPublicationsContent,
  getSiteSettings,
} from "@/lib/content";

export default async function Home() {
  const [home, profile, organizations, projects, publications, about, site, gallery] = await Promise.all([
    getHomeContent(),
    getProfileInfo(),
    getOrganizations(),
    getProjectsContent(),
    getPublicationsContent(),
    getAboutContent(),
    getSiteSettings(),
    getHomeGallery(),
  ]);

  const featuredProjects = projects.items.filter((project) => ["dengue-lens-nepal", "nepal-education-data-engine"].includes(project.id)).slice(0, 3);
  const featuredPublications = publications.items.slice(0, 3);
  const socialLinks = site.socialLinks.filter((link) => link.url);

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

  return (
    <main className="site-shell bg-dot-paper">
      <section className="mx-auto grid max-w-6xl items-start gap-10 px-6 pb-14 pt-14 md:grid-cols-[1.15fr_0.85fr] md:pb-16 md:pt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b83a74]">{home.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-display text-[3.6rem] font-semibold leading-[0.98] tracking-[-0.045em] md:text-[5.8rem] lg:text-[6.5rem]">
            {home.firstName}
            {home.lastName && <><br /><span className="text-[#8a5a72]">{home.lastName}</span></>}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#74455b] md:text-lg">{home.intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
            <Link href={home.primaryCta.href} className="font-semibold text-[#b83a74] underline decoration-[#b83a74]/30 underline-offset-8 hover:decoration-[#b83a74]">{home.primaryCta.label} →</Link>
            <Link href={home.secondaryCta.href} className="font-semibold text-[#5b2c43] underline decoration-[#b83a74]/20 underline-offset-8 hover:decoration-[#b83a74]/60">{home.secondaryCta.label} →</Link>
            {home.cv && <a href={home.cv.href} className="font-semibold text-[#5b2c43] underline decoration-[#b83a74]/20 underline-offset-8 hover:decoration-[#b83a74]/60">{home.cv.label} →</a>}
          </div>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.14em] text-[#8a5a72]">
              {socialLinks.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="hover:text-[#b83a74]">{link.label}</a>)}
            </div>
          )}
          <div className="mt-5 border-t border-[#f2c3d5] pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b83a74]">Education</p>
            <div className="mt-3 space-y-3">
              {about.education.map((item) => (
                <div key={item.school}>
                  <p className="font-display text-base leading-tight">{item.school}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#8a5a72]">{item.detail}</p>
                  <p className="mt-1 text-xs font-semibold text-[#b83a74]">{item.years}</p>
                </div>
              ))}
            </div>
          </div>
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
          />        </div>
      </section>

      <HomeGalleryWall photos={gallery} />

      {featuredPublications.length > 0 && (
        <section className="border-t border-[#f2c3d5] bg-[#fde6ee]/75 px-6 py-12 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <div><p className="section-label">Research</p><h2 className="section-title">Studies, data, and questions.</h2></div>
              <Link href="/research" className="hidden text-sm font-semibold text-[#b83a74] md:block">View research →</Link>
            </div>
            <div className="mt-8 divide-y divide-[#efbcd0] border-y border-[#efbcd0]">
              {featuredPublications.map((publication, index) => (
                <article key={publication.id} className="grid gap-4 py-6 md:grid-cols-[3rem_minmax(0,1fr)_14rem]">
                  <span className="font-display text-xl text-[#dd9db9]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a5a72]">{publication.category} · {publication.byline}</p>
                    <div className="mt-2 flex items-center gap-3"><WorkMark kind={publication.id.includes("amr") ? "genomics" : publication.id.includes("dengue") ? "epidemiology" : "survey"} /><h3 className="max-w-3xl font-display text-xl leading-snug">{publication.links.find((link) => link.url)?.url ? <a href={publication.links.find((link) => link.url)!.url} target="_blank" rel="noreferrer" className="hover:text-[#b83a74]">{publication.title} ↗</a> : publication.title}</h3></div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#74455b]">{publication.summary}</p>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-[#efbcd0] pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-1">
                    <p className="text-xs leading-5 text-[#8a5a72]">{publication.status}</p>
                    {publication.links.filter((link) => link.url).slice(0, 2).map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#b83a74]">{link.label} ↗</a>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredProjects.length > 0 && (
        <section className="border-t border-[#f2c3d5] px-6 py-12 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <div><p className="section-label">Selected projects</p><h2 className="section-title">Tools built to be used.</h2></div>
              <Link href="/projects" className="hidden text-sm font-semibold text-[#b83a74] md:block">View all →</Link>
            </div>
            <div className="mt-8 divide-y divide-[#f2c3d5] border-y border-[#f2c3d5]">
              {featuredProjects.map((project, index) => (
                <article key={project.id} className="grid gap-4 py-6 md:grid-cols-[3rem_minmax(0,1fr)_12rem]">
                  <span className="font-display text-xl text-[#dd9db9]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b83a74]">{project.category} · {project.status}</p>
                    <div className="mt-2 flex items-center gap-3"><WorkMark kind={project.id === "dengue-lens-nepal" ? "web" : "data"} /><h3 className="font-display text-2xl leading-tight">{project.title}</h3></div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#74455b]">{project.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-[#f6d3e1] pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-1">
                    {project.linkUrl && <a href={project.linkUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#b83a74]">Open live project ↗</a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#5b2c43]">Source code ↗</a>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#f2c3d5] px-6 py-12 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div><p className="section-label">About</p><h2 className="section-title">A little about me.</h2></div>
          <div>
            <p className="max-w-3xl text-lg leading-8 text-[#74455b] line-clamp-4 md:text-xl">{about.body}</p>
            <Link href="/about" className="mt-5 inline-block text-sm font-semibold text-[#b83a74] underline decoration-[#b83a74]/30 underline-offset-8">Read more →</Link>
          </div>
        </div>
      </section>

      {(orderedOrganizations.length > 0 || profile.location || profile.email) && (
        <section className="border-t border-[#f2c3d5] px-6 py-10">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
            {orderedOrganizations.length > 0 && (
              <div>
                <p className="section-label">Organizations & communities</p>
                <div className="mt-6 flex flex-nowrap items-center gap-x-4 overflow-x-auto pb-1">
                  {orderedOrganizations.map((organization) => (
                    <div key={organization.id} className="flex items-center gap-2.5">
                      <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-[#ecb5cb] bg-[#fff8fb] ${/lsdt|icad|innovation/i.test(organization.name) ? "h-12 w-[4.5rem] rounded-md" : "h-12 w-12 rounded-full"}`}>
                        {organization.logoId ? <Image src={`/media/organization/${organization.id}?v=${organization.logoId}`} alt={organization.name} width={72} height={48} unoptimized className="h-full w-full object-contain" /> : <span className="text-xs font-bold text-[#a8336b]">{organization.name.slice(0, 2).toUpperCase()}</span>}
                      </div>
                      <span className="text-base font-bold text-[#5b2c43]">{organization.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs leading-5 text-[#8a5a72] md:text-right">
              <p>{profile.location}</p>
              {profile.email && <a href={`mailto:${profile.email}`} className="font-medium text-[#b83a74]">{profile.email}</a>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
