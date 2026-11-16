import Image from "next/image";
import { PronunciationPlayer } from "@/app/_components/pronunciation-player";
import { SocialIcon } from "@/app/_components/social-icon";
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
  pronunciation,
  pronunciationAudioUrl,
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
  pronunciation?: string;
  pronunciationAudioUrl?: string;
  cv?: { label: string; href: string };
}) {
  // ORCID, GitHub, LinkedIn and the rest in the order set in the admin, then email.
  const contacts: { label: string; href: string; external: boolean }[] = [
    ...socialLinks.flatMap((link) => (link.url ? [{ label: link.label, href: link.url, external: true }] : [])),
    ...(email ? [{ label: "Email", href: `mailto:${email}`, external: false }] : []),
  ];

  return (
    <div className="text-center">
      <div className="mx-auto w-36 overflow-hidden rounded-2xl bg-[#e8e1e3] shadow-[0_8px_20px_-10px_rgba(150,80,111,0.45)] ring-4 ring-[#f1e3e9]">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={photoAlt}
            width={440}
            height={550}
            unoptimized
            priority
            className="aspect-[4/5] w-full origin-[50%_75%] scale-[1.3] object-cover object-[50%_50%]"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center font-display text-3xl text-[#96506f]">{initials}</div>
        )}
      </div>

      <h2 className="mt-6 font-display text-[1.75rem] font-medium leading-tight tracking-[-0.01em] text-[#4a3440]">{name}</h2>
      {pronunciation && <p className="mt-1.5 text-sm italic text-[#7b6670]">{pronunciation}</p>}
      {pronunciationAudioUrl && <PronunciationPlayer src={pronunciationAudioUrl} />}
      <p className="mt-3 font-display text-[0.8rem] font-light uppercase leading-5 tracking-[0.1em] text-[#4a3440]">{role}</p>

      {contacts.length > 0 && (
        <ul className="mx-auto mt-5 flex flex-wrap justify-center gap-x-1.5 gap-y-3">
          {contacts.map((contact) => (
            <li key={contact.label}>
              <a
                href={contact.href}
                {...(contact.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex w-[3.9rem] flex-col items-center gap-1 text-[#96506f] transition-colors hover:text-[#6f3a52]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9e3dc] bg-white/60 text-[#6f8f78] transition-colors group-hover:border-[#8fb09a] group-hover:bg-[#e6efe8] group-hover:text-[#4f7459]">
                  <SocialIcon label={contact.label} />
                </span>
                <span className="text-[0.7rem] leading-4 underline-offset-4 group-hover:underline">{contact.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {location && <p className="mt-4 text-xs leading-5 text-[#7b6670]">{location}</p>}

      {cv && (
        <a
          href={cv.href}
          className="mt-5 inline-block rounded-full border border-[#96506f]/50 px-5 py-1.5 text-sm text-[#96506f] transition-colors hover:bg-[#96506f]/10"
        >
          {cv.label}
        </a>
      )}
    </div>
  );
}
