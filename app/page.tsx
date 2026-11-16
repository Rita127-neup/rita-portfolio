import Image from "next/image";
import Link from "next/link";
import { InnerShell } from "@/app/_components/inner-shell";
import { SectionShell } from "@/app/_components/section-shell";
import { Testimonials } from "@/app/_components/testimonials";
import { getAboutContent, getAboutExtras, getHomeContent, getOrganizations, getTestimonials } from "@/lib/content";
import { AboutCard } from "@/app/_components/about-card";
import { displayName } from "@/lib/display";

const textLink = "inline-block py-1 text-[#96506f] underline underline-offset-4 transition-colors hover:text-[#6f3a52]";

/**
 * One page, top to bottom: who I am with the languages and hobbies beside it, kind words, and
 * the organizations at the end. The work itself is described once, on Research,
 * Publications and Projects.
 */
export default async function Home() {
  const [home, about, extras, organizations, testimonials] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
    getAboutExtras(),
    getOrganizations(),
    getTestimonials(),
  ]);

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
    <InnerShell fullProfileOnMobile>
      <h1 className="sr-only">{displayName(home.firstName, home.lastName)}</h1>

      <p className="max-w-xl pt-1 font-display text-xl leading-8 text-[#4a3440]">{home.intro}</p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 pb-10 text-sm">
        <Link href={home.primaryCta.href} className={textLink}>{home.primaryCta.label} →</Link>
        <Link href="/publications" className={textLink}>Read my publications →</Link>
      </div>

      <SectionShell id="about" title="About">
        <div className="@container pt-2">
          <div className="grid gap-8 @3xl:grid-cols-[minmax(0,1fr)_14.5rem] @3xl:gap-10">
            <div>
              <div className="max-w-[46rem] space-y-5 leading-[1.8] text-[#55454d]">
                {extras.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {about.education.length > 0 && (
                <div className="mt-8 max-w-[46rem]">
                  <h3 className="editorial-kicker">Education</h3>
                  <ol className="mt-4 space-y-4">
                    {about.education.map((item) => (
                      <li key={`${item.school}-${item.years}`}>
                        <p className="font-display text-lg font-medium leading-snug text-[#4a3440]">{item.school}</p>
                        <p className="mt-0.5 text-sm leading-6 text-[#7b6670]">
                          {[item.detail, item.years].filter(Boolean).join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <AboutCard languages={extras.languages} hobbies={extras.hobbies} />
          </div>
        </div>
      </SectionShell>

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
    </InnerShell>
  );
}
