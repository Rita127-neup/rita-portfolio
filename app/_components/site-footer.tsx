import Link from "next/link";
import { DnaMark } from "@/app/_components/dna-mark";

type FooterLink = { label: string; href: string };

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8f78]";
const topics = ["Research", "Computational biology", "Public health"];

/**
 * The closing card on every public page: the helix mark, the name in the display serif, a short
 * description of the work, the menu again, and the email and location from the profile settings.
 * The owner login stays in the small print.
 */
export function SiteFooter({ links, email, location }: { links: FooterLink[]; email?: string; location?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-[84rem] px-6 pb-10 pt-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] bg-white/60 px-6 py-10 text-center shadow-[0_22px_44px_-34px_rgba(63,100,80,0.55)] ring-1 ring-[#e3e6e1] md:px-12">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e6efe8] ring-1 ring-[#d3e1d8]">
            <DnaMark className="h-8 w-8" />
          </span>

          <p className="mt-4 font-display text-[1.65rem] font-medium leading-tight tracking-[-0.01em] text-[#4a3440]">
            Rita Neupane
          </p>
          <p className="mt-2 flex flex-col items-center text-[0.72rem] font-medium uppercase leading-5 tracking-[0.14em] text-[#4f7459] md:block md:text-[0.75rem] md:tracking-[0.2em]">
            {topics.map((topic, index) => (
              <span key={topic}>
                <span className="whitespace-nowrap">
                  {topic}
                  {index < topics.length - 1 && (
                    <span aria-hidden="true" className="hidden pl-1.5 text-[#d3a1b8] md:inline">
                      ·
                    </span>
                  )}
                </span>{" "}
              </span>
            ))}
          </p>

          <nav aria-label="Footer" className="mt-6 flex flex-wrap justify-center gap-1">
            {links.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-[0.95rem] font-medium leading-5 text-[#55454d] transition-colors hover:bg-[#e6efe8] hover:text-[#3f6450] ${focusRing}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {(email || location) && (
            <div className="mt-5 flex flex-col items-center gap-1 text-[0.9rem] leading-6 text-[#7b6670] sm:flex-row sm:justify-center sm:gap-x-3">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className={`rounded-sm underline decoration-[#c9d8cd] decoration-1 underline-offset-4 transition-colors hover:text-[#3f6450] hover:decoration-[#6f8f78] ${focusRing}`}
                >
                  {email}
                </a>
              )}
              {email && location && (
                <span aria-hidden="true" className="hidden text-[#d3a1b8] sm:inline">
                  ✿
                </span>
              )}
              {location && <span>{location}</span>}
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col items-center gap-1 text-[0.8rem] text-[#7b6670] sm:flex-row sm:justify-between">
          <span>
            © {year} Rita Neupane <span aria-hidden="true" className="px-0.5 text-[#d3a1b8]">✿</span> Made in Nepal
          </span>
          <Link href="/admin/login" className={`rounded-full px-2 py-1 transition-colors hover:text-[#3f6450] ${focusRing}`}>
            Owner login
          </Link>
        </div>
      </div>
    </footer>
  );
}
