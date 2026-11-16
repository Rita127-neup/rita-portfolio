import Image from "next/image";
import Link from "next/link";
import { HomeGalleryWall } from "@/app/_components/home-gallery-wall";
import { InnerShell } from "@/app/_components/inner-shell";
import { SectionShell } from "@/app/_components/section-shell";
import { Testimonials } from "@/app/_components/testimonials";
import { WorkMark } from "@/app/_components/work-mark";
import {
  getAboutContent,
  getContactContent,
  getHomeContent,
  getHomeGallery,
  getOrganizations,
  getProfileInfo,
  getProjectsContent,
  getPublicationsContent,
  getSiteSettings,
} from "@/lib/content";
import { testimonials } from "@/lib/content/testimonials";
import { displayName, plainLabel } from "@/lib/display";

const textLink = "text-[#96506f] underline underline-offset-4 transition-colors hover:text-[#6f3a52]";
const cardTitle = "mb-2 mt-4 font-display text-xl font-medium leading-tight text-[#4a3440]";
const cardMeta = "text-xs uppercase tracking-[0.1em] text-[#7b6670]";

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
  const email = site.contactEmail || profile.email;

  const organizationPriority = ["National Innovation Center", "ICAD", "Rotaract Club of Central Lumbini", "LSDT"];
  const orderedOrganizations = [...organizations].sort((a, b) => {
    const ai = organizationPriority.indexOf(a.name);
    const bi = organizationPriority.indexOf(b.name);
    if (ai === -1 && bi === -1) return a.sortOrder - b.sortOrder;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <InnerShell>
      <h1 className="sr-only">{displayName(home.firstName, home.lastName)}</h1>

      <p className="max-w-xl pt-1 font-display text-xl leading-8 text-[#4a3440]">{home.intro}</p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 pb-10 text-sm">
        <Link href={home.primaryCta.href} className={textLink}>{home.primaryCta.label} →</Link>
        <Link href={home.secondaryCta.href} className={textLink}>{home.secondaryCta.label} →</Link>
      </div>

      <SectionShell id="about" title="About">
        <p className="pb-2 pt-4 leading-7">{about.intro}</p>
      </SectionShell>

      {featuredPublications.length > 0 && (
        <SectionShell id="research" title="Research" href="/research">
          {featuredPublications.map((publication) => {
            const firstLink = publication.links.find((link) => link.url);
            return (
              <article key={publication.id} className="pb-3">
                <h3 className={cardTitle}>
                  <Link href="/research" className="transition-opacity hover:opacity-70">{publication.title}</Link>
                </h3>
                <div className="flex items-start gap-4">
                  <WorkMark kind={publication.id.includes("amr") ? "genomics" : publication.id.includes("dengue") ? "epidemiology" : "survey"} />
                  <div className="min-w-0">
                    <p className={cardMeta}>{publication.category} · {publication.status}</p>
                    <p className="mt-2 line-clamp-3 leading-7">{publication.summary}</p>
                    <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                      <Link href="/research" className={textLink}>Read more</Link>
                      {firstLink && (
                        <a href={firstLink.url} target="_blank" rel="noreferrer" className={textLink}>{plainLabel(firstLink.label)} ↗</a>
                      )}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </SectionShell>
      )}

      {featuredProjects.length > 0 && (
        <SectionShell id="projects" title="Projects" href="/projects">
          {featuredProjects.map((project) => (
            <article key={project.id} className="pb-3">
              <h3 className={cardTitle}>
                <Link href={`/projects#${project.id}`} className="transition-opacity hover:opacity-70">{project.title}</Link>
              </h3>
              <div className="flex items-start gap-4">
                <WorkMark kind={project.id === "dengue-lens-nepal" ? "web" : "data"} />
                <div className="min-w-0">
                  <p className={cardMeta}>{project.category} · {project.status}</p>
                  <p className="mt-2 line-clamp-3 leading-7">{project.description}</p>
                  <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <Link href={`/projects#${project.id}`} className={textLink}>Read more</Link>
                    {project.linkUrl && <a href={project.linkUrl} target="_blank" rel="noreferrer" className={textLink}>Live project ↗</a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className={textLink}>Source code ↗</a>}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </SectionShell>
      )}

      <Testimonials items={testimonials} />

      {orderedOrganizations.length > 0 && (
        <SectionShell id="organizations" title="Organizations">
          <ul className="flex flex-wrap gap-x-8 gap-y-4 pb-2 pt-4">
            {orderedOrganizations.map((organization) => (
              <li key={organization.id} className="flex items-center gap-3">
                <span
                  className={`flex h-10 shrink-0 items-center justify-center overflow-hidden border border-[#ddd5d6] bg-white ${
                    /lsdt|icad|innovation/i.test(organization.name) ? "w-16 rounded-md" : "w-10 rounded-full"
                  }`}
                >
                  {organization.logoId ? (
                    <Image
                      src={`/media/organization/${organization.id}?v=${organization.logoId}`}
                      alt={organization.name}
                      width={72}
                      height={48}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-[#96506f]">{organization.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </span>
                <span className="text-sm">{organization.name}</span>
              </li>
            ))}
          </ul>
        </SectionShell>
      )}

      {about.education.length > 0 && (
        <SectionShell id="education" title="Education">
          <ol className="space-y-5 pb-2 pt-4">
            {about.education.map((item) => (
              <li key={`${item.school}-${item.years}`} className="grid gap-0.5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-5">
                <p className={`${cardMeta} sm:pt-1.5`}>{item.years}</p>
                <div>
                  <p className="font-display text-lg font-medium leading-snug text-[#4a3440]">{item.school}</p>
                  <p className="text-sm text-[#55454d]">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionShell>
      )}

      <HomeGalleryWall photos={gallery} />

      <SectionShell id="contact" title="Contact" href="/contact" linkLabel="Contact page →">
        <p className="max-w-lg pt-4 leading-7 text-[#55454d]">{contact.intro}</p>
        {email && (
          <a
            href={`mailto:${email}`}
            className="mt-4 inline-block break-all font-display text-xl text-[#96506f] underline decoration-[#96506f]/30 underline-offset-8 transition-colors hover:text-[#6f3a52] md:text-2xl"
          >
            {email}
          </a>
        )}
      </SectionShell>
    </InnerShell>
  );
}
