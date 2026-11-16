import Link from "next/link";

export function SectionShell({
  id,
  number,
  title,
  href,
  linkLabel,
  children,
}: {
  id: string;
  number: string;
  title: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-[#f2c3d5] py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-12">
        <header className="md:sticky md:top-24 md:self-start">
          <p className="font-display text-5xl font-light leading-none text-[#e8a3bf] md:text-6xl">{number}</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#5b2c43]">{title}</h2>
          {href && linkLabel && (
            <Link href={href} className="mt-4 inline-block text-sm font-semibold text-[#b83a74] transition hover:text-[#8f2a5a]">
              {linkLabel}
            </Link>
          )}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
