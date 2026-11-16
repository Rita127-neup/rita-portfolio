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
  birthday,
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
  birthday: string;
  cv?: { label: string; href: string };
}) {
  const links = socialLinks.filter((link) => link.url);

  return (
    <div className="text-center">
      <div className="mx-auto w-36 overflow-hidden rounded-lg bg-[#e8e1e3]">
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
          <div className="flex aspect-[4/5] items-center justify-center font-display text-3xl text-[#96506f]">{initials}</div>
        )}
      </div>

      <h2 className="mt-6 font-display text-[1.75rem] font-medium leading-tight tracking-[-0.01em] text-[#4a3440]">{name}</h2>
      <p className="mt-3 font-display text-[0.8rem] font-light uppercase leading-5 tracking-[0.1em] text-[#4a3440]">{role}</p>

      {links.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-[#96506f] underline-offset-4 transition-colors hover:text-[#6f3a52] hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {(birthday || location || email) && (
        <div className="mt-5 space-y-1 text-xs leading-5 text-[#7b6670]">
          {birthday && <p>Born {birthday}</p>}
          {location && <p>{location}</p>}
          {email && (
            <a href={`mailto:${email}`} className="inline-block break-all text-[#96506f] transition-colors hover:text-[#6f3a52]">
              {email}
            </a>
          )}
        </div>
      )}

      {cv && (
        <a
          href={cv.href}
          className="mt-5 inline-block border border-[#96506f]/50 px-4 py-1.5 text-sm text-[#96506f] transition-colors hover:bg-[#96506f]/10"
        >
          {cv.label}
        </a>
      )}
    </div>
  );
}
