import Image from "next/image";
import Link from "next/link";
import { ProjectVisual } from "@/app/_components/project-visual";
import {
  getAboutContent,
  getHomeContent,
  getOrganizations,
  getProfileInfo,
  getProjectsContent,
  getPublicationsContent,
  getSiteSettings,
} from "@/lib/content";

export default async function Home() {
  const [home, profile, organizations, projects, publications, about, site] = await Promise.all([
    getHomeContent(),
    getProfileInfo(),
    getOrganizations(),
    getProjectsContent(),
    getPublicationsContent(),
    getAboutContent(),
    getSiteSettings(),
  ]);

  const featuredProjects = projects.items.slice(0, 3);
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
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-14 pt-14 md:grid-cols-[1.15fr_0.85fr] md:pb-18 md:pt-18">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a742d]">{home.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-display text-[3.6rem] font-semibold leading-[0.98] tracking-[-0.045em] md:text-[5.8rem] lg:text-[6.5rem]">
            {home.firstName}
            {home.lastName && <><br /><span className="text-[#6f746d]">{home.lastName}</span></>}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#555b55] md:text-lg">{home.intro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
            <Link href={home.primaryCta.href} className="font-semibold text-[#9a742d] underline decoration-[#9a742d]/30 underline-offset-8 hover:decoration-[#9a742d]">{home.primaryCta.label} →</Link>
            <Link href={home.secondaryCta.href} className="font-semibold text-[#30342f] underline decoration-black/15 underline-offset-8 hover:decoration-black/50">{home.secondaryCta.label} →</Link>
            {home.cv && <a href={home.cv.href} className="font-semibold text-[#30342f] underline decoration-black/15 underline-offset-8 hover:decoration-black/50">{home.cv.label} →</a>}
          </div>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.14em] text-[#777b86]">
              {socialLinks.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="hover:text-[#9a742d]">{link.label}</a>)}
            </div>
          )}
        </div>
        <div className="mx-auto w-full max-w-xs md:justify-self-end">
          <div className="overflow-hidden rounded-[1.5rem] bg-[#dedbd2]">
            {home.photoUrl ? (
              <Image src={home.photoUrl} alt={home.photoAlt} width={640} height={800} unoptimized loading="eager" className="aspect-[4/5] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center"><span className="font-display text-5xl text-[#9a742d]">{home.photoPlaceholderInitials}</span></div>
            )}
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="border-t border-[#d8cfbb] px-6 py-12 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <div><p className="section-label">Selected work</p><h2 className="section-title">Built and investigated.</h2></div>
              <Link href="/projects" className="hidden text-sm font-semibold text-[#9a742d] md:block">View all →</Link>
            </div>
            <div className="mt-7 grid gap-6 md:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <Link key={project.id} href={"/projects#" + project.id} className="group overflow-hidden rounded-2xl border border-[#d8cfbb] bg-[#fbf6e8] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(50,43,30,0.10)]">
                  <ProjectVisual id={project.id} imageId={project.imageId} title={project.title} category={project.category} compact />
                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a742d]">{project.category}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-[#9a742d]">{project.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#666c78]">{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredPublications.length > 0 && (
        <section className="border-t border-[#d8cfbb] bg-[#eee7d4] px-6 py-12 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <div><p className="section-label">My research</p><h2 className="section-title">Research I have conducted.</h2></div>
              <Link href="/publications" className="hidden text-sm font-semibold text-[#9a742d] md:block">All →</Link>
            </div>
            <div className="mt-6 grid gap-x-8 md:grid-cols-3">
              {featuredPublications.map((publication) => (
                <article key={publication.id} className="border-t border-[#d8cfbb] py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#777b86]">{publication.category}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">{publication.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#666c78]">{publication.byline}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {publication.links.filter((link) => link.url).slice(0, 2).map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9a742d]">{link.label} ↗</a>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#d8cfbb] px-6 py-12 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div><p className="section-label">About</p><h2 className="section-title">A little about me.</h2></div>
          <div>
            <p className="max-w-3xl text-lg leading-8 text-[#555b67] line-clamp-4 md:text-xl">{about.body}</p>
            <Link href="/about" className="mt-5 inline-block text-sm font-semibold text-[#9a742d] underline decoration-[#9a742d]/30 underline-offset-8">Read more →</Link>
          </div>
        </div>
      </section>

      {(orderedOrganizations.length > 0 || profile.location || profile.email) && (
        <section className="border-t border-[#d8cfbb] px-6 py-10">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
            {orderedOrganizations.length > 0 && (
              <div>
                <p className="section-label">Organizations & communities</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
                  {orderedOrganizations.map((organization) => (
                    <div key={organization.id} className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d8cfbb] bg-[#fbf6e8]">
                        {organization.logoId ? <Image src={`/media/organization/${organization.id}?v=${organization.logoId}`} alt={organization.name} width={36} height={36} unoptimized className="h-full w-full object-contain p-1" /> : <span className="text-[10px] font-semibold text-[#9a742d]">{organization.name.slice(0, 2).toUpperCase()}</span>}
                      </div>
                      <span className="text-xs font-medium text-[#454a55]">{organization.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs leading-5 text-[#777b86] md:text-right">
              <p>{profile.location}</p>
              {profile.email && <a href={`mailto:${profile.email}`} className="font-medium text-[#9a742d]">{profile.email}</a>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
