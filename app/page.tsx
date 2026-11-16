import Image from "next/image";
import Link from "next/link";
import { HomeGalleryWall } from "@/app/_components/home-gallery-wall";
import { InnerShell } from "@/app/_components/inner-shell";
import { SectionShell } from "@/app/_components/section-shell";
import { Testimonials } from "@/app/_components/testimonials";
import { getHomeContent, getHomeGallery, getOrganizations, getTestimonials } from "@/lib/content";
import { displayName } from "@/lib/display";

const textLink = "inline-block py-1 text-[#96506f] underline underline-offset-4 transition-colors hover:text-[#6f3a52]";

/**
 * The home page introduces and points onward. The work itself is described once,
 * on Research and Projects; the biography once, on About.
 */
export default async function Home() {
  const [home, organizations, gallery, testimonials] = await Promise.all([
    getHomeContent(),
    getOrganizations(),
    getHomeGallery(),
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
        <Link href={home.secondaryCta.href} className={textLink}>{home.secondaryCta.label} →</Link>
      </div>

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

      <Testimonials items={testimonials} />

      <HomeGalleryWall photos={gallery} />
    </InnerShell>
  );
}
