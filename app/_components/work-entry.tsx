import { plainLabel } from "@/lib/display";

export type EntryLink = { label: string; url: string };

/**
 * One piece of work on the Research or Projects page: what it is, who did
 * what, a short write-up, and where to read or open it.
 */
export function WorkEntry({
  id,
  kicker,
  title,
  lines = [],
  contribution,
  tags = [],
  links = [],
  children,
}: {
  id: string;
  kicker?: string;
  title: string;
  /** Small lines under the title: authorship, role, status. */
  lines?: string[];
  contribution?: string;
  tags?: string[];
  links?: EntryLink[];
  children: React.ReactNode;
}) {
  return (
    <article id={id} className="scroll-mt-8 border-t border-[#ddd5d6] py-10 first:border-t-0 first:pt-2">
      {kicker && <p className="editorial-kicker">{kicker}</p>}
      <h2 className="mt-2 max-w-[40rem] font-display text-[1.35rem] font-medium leading-snug tracking-[-0.005em] text-[#4a3440] md:text-[1.55rem]">
        {title}
      </h2>

      {lines.length > 0 && (
        <div className="mt-3 space-y-0.5 text-sm leading-6 text-[#7b6670]">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      <div className="mt-5 max-w-[38rem] space-y-4 leading-[1.8] text-[#55454d]">{children}</div>

      {contribution && <p className="mt-5 max-w-[38rem] text-sm leading-6 text-[#7b6670]">{contribution}</p>}

      {tags.length > 0 && <p className="mt-4 max-w-[38rem] text-xs leading-5 text-[#7b6670]">{tags.join(" · ")}</p>}

      {links.length > 0 && (
        <p className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block py-1 text-[#96506f] underline underline-offset-4 transition-colors hover:text-[#6f3a52]"
            >
              {plainLabel(link.label)} ↗
            </a>
          ))}
        </p>
      )}
    </article>
  );
}
