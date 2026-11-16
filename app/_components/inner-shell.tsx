import { getAboutExtras, getHomeContent, getProfileInfo, getSiteSettings } from "@/lib/content";
import { ProfileCard } from "@/app/_components/profile-card";
import { displayName } from "@/lib/display";

/**
 * Every public page: profile on the left, the page's own content on the right.
 * On a phone the full profile card would push the page's content below the
 * fold, so only the home page shows it in full there. The other pages open
 * with a one-line name instead.
 */
export async function InnerShell({
  children,
  fullProfileOnMobile = false,
}: {
  children: React.ReactNode;
  fullProfileOnMobile?: boolean;
}) {
  const [home, profile, site, extras] = await Promise.all([
    getHomeContent(),
    getProfileInfo(),
    getSiteSettings(),
    getAboutExtras(),
  ]);

  return (
    <main className="site-shell">
      <div className="mx-auto flex w-full max-w-[84rem] flex-col gap-10 px-6 pb-16 pt-6 lg:flex-row lg:items-start lg:gap-16 lg:pt-10">
        <aside className={`w-full shrink-0 lg:sticky lg:top-8 lg:block lg:w-[17rem] ${fullProfileOnMobile ? "" : "hidden"}`}>
          <ProfileCard
            name={displayName(home.firstName, home.lastName)}
            role={home.eyebrow}
            photoUrl={home.photoUrl}
            photoAlt={home.photoAlt}
            initials={home.photoPlaceholderInitials}
            socialLinks={site.socialLinks}
            email={profile.email}
            location={profile.location}
            pronunciation={home.pronunciation}
            pronunciationAudioUrl={extras.pronunciationAudioUrl}
            cv={home.cv}
          />
        </aside>
        <div className="min-w-0 flex-1">
          {!fullProfileOnMobile && (
            <div className="mb-8 text-center lg:hidden">
              <p className="font-display text-[1.35rem] font-medium leading-tight text-[#4a3440]">
                {displayName(home.firstName, home.lastName)}
              </p>
              <p className="mt-1 text-[0.7rem] uppercase tracking-[0.1em] text-[#7b6670]">{home.eyebrow}</p>
              {home.cv && (
                <a
                  href={home.cv.href}
                  className="mt-2 inline-block py-1 text-sm text-[#96506f] underline underline-offset-4 transition-colors hover:text-[#6f3a52]"
                >
                  {home.cv.label}
                </a>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </main>
  );
}
