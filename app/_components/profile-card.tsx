import Image from "next/image";
import type { SocialLink } from "@/lib/content";

export function ProfileCard({
  name,
  role,
  photoUrl,
  photoAlt,
  initials,
  socialLinks,
  email,
  location,
  cv,
}: {
  name: string;
  role: string;
  photoUrl?: string;
  photoAlt: string;
  initials: string;
  socialLinks: SocialLink[];
  email: string;
  location: string;
  cv?: { label: string; href: string };
}) {
  const links = socialLinks.filter((link) => link.url);

  return (
    <div className="relative flex items-center gap-5 rounded-[1.75rem] border border-[#f2c3d5] bg-white/90 p-5 shadow-[0_14px_36px_rgba(184,58,116,0.12)] lg:block lg:p-7 lg:text-center">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#e8a3bf" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute -left-3 -top-3 hidden h-9 w-9 -rotate-12 lg:block"><path d="M12 21s-7-4.6-9.2-9.1C1.3 8.6 3.2 5 6.6 5c2 0 3.7 1.2 4.9 3 1.2-1.8 2.9-3 4.9-3 3.4 0 5.3 3.6 3.8 6.9C19 16.4 12 21 12 21z" fill="#fde6ee" /></svg>
      <div className="w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-[#fbd9e6] shadow-[0_8px_22px_rgba(184,58,116,0.18)] lg:mx-auto lg:w-full lg:max-w-[11rem]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={photoAlt}
            width={440}
            height={550}
            unoptimized
            priority
            className="aspect-[4/5] w-full scale-[1.08] object-cover object-[50%_30%]"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center font-display text-3xl text-[#b83a74]">{initials}</div>
        )}
      </div>
      <div className="min-w-0 lg:mt-6">
        <h2 className="font-display text-2xl font-semibold leading-[1.08] tracking-[-0.02em] text-[#5b2c43] lg:text-[1.95rem]">{name}</h2>
        <p className="mt-2 text-[0.66rem] font-semibold uppercase leading-5 tracking-[0.2em] text-[#8a5a72] lg:mt-3">{role}</p>
        {links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 lg:mt-5 lg:justify-center">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#f2c3d5] bg-[#fff8fb] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#b83a74] transition hover:bg-[#fde6ee]"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
        {(email || location) && (
          <div className="mt-4 hidden space-y-1 text-xs leading-5 text-[#8a5a72] lg:block">
            {location && <p>{location}</p>}
            {email && (
              <a href={`mailto:${email}`} className="break-all font-medium text-[#b83a74] hover:text-[#8f2a5a]">
                {email}
              </a>
            )}
          </div>
        )}
        {cv && (
          <a
            href={cv.href}
            className="mt-5 hidden rounded-full bg-[#b83a74] px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#8f2a5a] lg:inline-block"
          >
            {cv.label}
          </a>
        )}
      </div>
    </div>
  );
}
