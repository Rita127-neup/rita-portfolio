import { getHomeContent, getProfileInfo, getSiteSettings } from "@/lib/content";
import { ProfileCard } from "@/app/_components/profile-card";

export async function InnerShell({ children }: { children: React.ReactNode }) {
  const [home, profile, site] = await Promise.all([getHomeContent(), getProfileInfo(), getSiteSettings()]);

  return (
    <main className="site-shell">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-20 pt-8 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-14 lg:pt-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProfileCard
            name={[home.firstName, home.lastName].filter(Boolean).join(" ")}
            role={home.eyebrow}
            photoUrl={home.photoUrl}
            photoAlt={home.photoAlt}
            initials={home.photoPlaceholderInitials}
            socialLinks={site.socialLinks}
            email={profile.email}
            location={profile.location}
            cv={home.cv}
          />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}
