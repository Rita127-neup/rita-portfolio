import { getHomeContent, getProfileInfo, getSiteSettings } from "@/lib/content";
import { ProfileCard } from "@/app/_components/profile-card";
import { displayName } from "@/lib/display";

/** Every public page: profile on the left, the page's own content on the right. */
export async function InnerShell({ children }: { children: React.ReactNode }) {
  const [home, profile, site] = await Promise.all([getHomeContent(), getProfileInfo(), getSiteSettings()]);

  return (
    <main className="site-shell">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-6 lg:flex-row lg:items-start lg:gap-16 lg:pt-10">
        <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-[17rem]">
          <ProfileCard
            name={displayName(home.firstName, home.lastName)}
            role={home.eyebrow}
            photoUrl={home.photoUrl}
            photoAlt={home.photoAlt}
            initials={home.photoPlaceholderInitials}
            socialLinks={site.socialLinks}
            email={profile.email}
            location={profile.location}
            birthday={profile.birthday}
            cv={home.cv}
          />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
