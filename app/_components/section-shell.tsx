import Link from "next/link";

/**
 * One block of a page: a small uppercase label with a hairline above it,
 * the content, and an optional "See all" link on the right.
 */
export function SectionShell({
  id,
  title,
  href,
  linkLabel = "See all →",
  children,
}: {
  id: string;
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 pt-10 first:pt-0">
      <h2 className="border-t border-[#ddd5d6] py-4 font-display text-[0.95rem] font-semibold uppercase tracking-[0.1em] text-[#96506f]">
        <span aria-hidden="true" className="mr-2 text-[0.7rem] text-[#8fb09a]">✿</span>
        {href ? (
          <Link href={href} className="transition-opacity hover:opacity-70">
            {title}
          </Link>
        ) : (
          title
        )}
      </h2>
      <div>{children}</div>
      {href && (
        <p className="pt-4 text-right text-[0.8rem] uppercase tracking-[0.1em]">
          <Link href={href} className="inline-block py-1.5 text-[#96506f] transition-opacity hover:opacity-70">
            {linkLabel}
          </Link>
        </p>
      )}
    </section>
  );
}
