import Image from "next/image";
import Link from "next/link";
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
    <main className="min-h-screen bg-[#f5f3ee] text-[#171917]">
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-20 md:grid-cols-[1.15fr_0.85fr] md:pb-28 md:pt-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#315c4a]">
            {home.eyebrow}
          </p>

          <h1 className="mt-5 font-serif text-6xl leading-[0.92] tracking-[-0.045em] md:text-8xl">
            {home.firstName}
            {home.lastName && (
              <>
                <br />
                <span className="text-[#6f746d]">{home.lastName}</span>
              </>
            )}
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#555b55] md:text-xl">
            {home.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm">
            <Link href={home.primaryCta.href} className="font-semibold text-[#315c4a] underline decoration-[#315c4a]/30 underline-offset-8 transition hover:decoration-[#315c4a]">
              {home.primaryCta.label} →
            </Link>
            <Link href={home.secondaryCta.href} className="font-semibold text-[#30342f] underline decoration-black/15 underline-offset-8 transition hover:decoration-black/50">
              {home.secondaryCta.label} →
            </Link>
            {home.cv && (
              <a href={home.cv.href} className="font-semibold text-[#30342f] underline decoration-black/15 underline-offset-8 transition hover:decoration-black/50">
                {home.cv.label} →
              </a>
            )}
          </div>

          {socialLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.16em] text-[#777c75]">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="transition hover:text-[#315c4a]">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto w-full max-w-sm md:justify-self-end">
          <div className="overflow-hidden rounded-[2rem] bg-[#dedbd2]">
            {home.photoUrl ? (
              <Image
                src={home.photoUrl}
                alt={home.photoAlt}
                width={720}
                height={900}
                unoptimized
                loading="eager"
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center">
                <span className="font-serif text-6xl text-[#315c4a]">{home.photoPlaceholderInitials}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="border-t border-[#d8d5cd] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="section-label">Selected work</p>
                <h2 className="section-title">Things I have built and investigated.</h2>
              </div>
              <Link href="/projects" className="hidden text-sm font-semibold text-[#315c4a] md:block">View all →</Link>
            </div>

            <div className="mt-12 divide-y divide-[#d8d5cd] border-y border-[#d8d5cd]">
              {featuredProjects.map((project, index) => (
                <Link key={project.id} href={`/projects#${project.id}`} className="group grid gap-4 py-8 md:grid-cols-[72px_1fr_auto] md:items-start">
                  <span className="font-serif text-2xl text-[#9a9d97]">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777c75]">{project.category}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight group-hover:text-[#315c4a]">{project.title}</h3>
                    <p className="mt-2 max-w-2xl leading-7 text-[#646961]">{project.description}</p>
                  </div>
                  <span className="text-sm text-[#777c75] md:pt-1">View project ↗</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredPublications.length > 0 && (
        <section className="border-t border-[#d8d5cd] bg-[#ebe9e2] px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="section-label">Research & publications</p>
                <h2 className="section-title">Research I have contributed to.</h2>
              </div>
              <Link href="/publications" className="hidden text-sm font-semibold text-[#315c4a] md:block">All publications →</Link>
            </div>

            <div className="mt-10 grid gap-x-10 md:grid-cols-3">
              {featuredPublications.map((publication) => (
                <article key={publication.id} className="border-t border-[#cfcfc7] py-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777c75]">{publication.category}</p>
                  <h3 className="mt-3 text-xl font-semibold leading-snug">{publication.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#646961]">{publication.byline}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {publication.links.filter((link) => link.url).slice(0, 2).map((link) => (
                      <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-[0.12em] text-[#315c4a]">
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#d8d5cd] px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="section-label">About</p>
            <h2 className="section-title">A little about me.</h2>
          </div>
          <div>
            <p className="max-w-3xl text-xl leading-9 text-[#4f554f]">{about.body}</p>
            <Link href="/about" className="mt-7 inline-block text-sm font-semibold text-[#315c4a] underline decoration-[#315c4a]/30 underline-offset-8">
              Read more about me →
            </Link>
          </div>
        </div>
      </section>

      {orderedOrganizations.length > 0 && (
        <section className="border-t border-[#d8d5cd] px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="section-label">Organizations & communities</p>
                <h2 className="text-3xl font-semibold tracking-tight">Places I have worked and contributed.</h2>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
              {orderedOrganizations.map((organization) => (
                <div key={organization.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d2d0c8] bg-white">
                    {organization.logoId ? (
                      <Image src={`/media/organization/${organization.id}?v=${organization.logoId}`} alt={organization.name} width={40} height={40} unoptimized className="h-full w-full object-contain p-1" />
                    ) : (
                      <span className="text-xs font-semibold text-[#315c4a]">{organization.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#444943]">{organization.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#d8d5cd] px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label">Education</p>
            <h2 className="text-3xl font-semibold tracking-tight">Science, biology & mathematics.</h2>
            <p className="mt-3 text-sm text-[#646961]">Tilottama Secondary School · 2023–2025</p>
            <p className="mt-1 text-sm text-[#777c75]">Jaycees Boarding Secondary School · 2021–2023</p>
          </div>
          <div className="text-sm text-[#777c75]">
            <p>{profile.location}</p>
            {profile.email && <a href={`mailto:${profile.email}`} className="mt-1 block font-medium text-[#315c4a]">{profile.email}</a>}
          </div>
        </div>
      </section>
    </main>
  );
}
