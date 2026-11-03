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
          <div className="mt-5 border-t border-[#d8cfbb] pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a742d]">Education</p>
            <div className="mt-3 space-y-3">
              {about.education.map((item) => (
                <div key={item.school}>
                  <p className="font-display text-base leading-tight">{item.school}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#777b86]">{item.detail}</p>
                  <p className="mt-1 text-xs font-semibold text-[#9a742d]">{item.years}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md md:justify-self-end">
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
        <section className="border-t border-[#d8cfbb] bg-[#eee7d4] px-6 py-12 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <div><p className="section-label">Research</p><h2 className="section-title">Studies, data, and questions.</h2></div>
              <Link href="/research" className="hidden text-sm font-semibold text-[#9a742d] md:block">View research →</Link>
            </div>
            <div className="mt-8 divide-y divide-[#d1c6af] border-y border-[#d1c6af]">
              {featuredPublications.map((publication, index) => (
                <article key={publication.id} className="grid gap-4 py-6 md:grid-cols-[3rem_minmax(0,1fr)_14rem]">
                  <span className="font-display text-xl text-[#a5a397]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#777b86]">{publication.category} · {publication.byline}</p>
                    <div className="mt-2 flex items-center gap-3"><WorkMark kind={publication.id.includes("amr") ? "genomics" : publication.id.includes("dengue") ? "epidemiology" : "survey"} /><h3 className="max-w-3xl font-display text-xl leading-snug">{publication.links.find((link) => link.url)?.url ? <a href={publication.links.find((link) => link.url)!.url} target="_blank" rel="noreferrer" className="hover:text-[#9a742d]">{publication.title} ↗</a> : publication.title}</h3></div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#62676f]">{publication.summary}</p>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-[#d1c6af] pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-1">
                    <p className="text-xs leading-5 text-[#777b86]">{publication.status}</p>
                    {publication.links.filter((link) => link.url).slice(0, 2).map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9a742d]">{link.label} ↗</a>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredProjects.length > 0 && (
        <section className="border-t border-[#d8cfbb] px-6 py-12 md:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <div><p className="section-label">Selected projects</p><h2 className="section-title">Tools built to be used.</h2></div>
              <Link href="/projects" className="hidden text-sm font-semibold text-[#9a742d] md:block">View all →</Link>
            </div>
            <div className="mt-8 divide-y divide-[#d7cdb9] border-y border-[#d7cdb9]">
              {featuredProjects.map((project, index) => (
                <article key={project.id} className="grid gap-4 py-6 md:grid-cols-[3rem_minmax(0,1fr)_12rem]">
                  <span className="font-display text-xl text-[#a5a397]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a742d]">{project.category} · {project.status}</p>
                    <div className="mt-2 flex items-center gap-3"><WorkMark kind={project.id === "dengue-lens-nepal" ? "web" : "data"} /><h3 className="font-display text-2xl leading-tight">{project.title}</h3></div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#62676f]">{project.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-[#e3dac8] pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-1">
                    {project.linkUrl && <a href={project.linkUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#9a742d]">Open live project ↗</a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#454a55]">Source code ↗</a>}
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
                <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-6">
                  {orderedOrganizations.map((organization) => (
                    <div key={organization.id} className="flex items-center gap-2.5">
                      <div className={`flex h-14 shrink-0 items-center justify-center overflow-hidden border border-[#c9bea8] bg-[#fbf6e8] ${/lsdt|icad|innovation/i.test(organization.name) ? "w-20 rounded-md" : "w-14 rounded-full"}`}>
                        {organization.logoId ? <Image src={`/media/organization/${organization.id}?v=${organization.logoId}`} alt={organization.name} width={80} height={56} unoptimized className="h-full w-full object-contain p-1.5" /> : <span className="text-xs font-bold text-[#806020]">{organization.name.slice(0, 2).toUpperCase()}</span>}
                      </div>
                      <span className="text-base font-bold text-[#30342f]">{organization.name}</span>
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
