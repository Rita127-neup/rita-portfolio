import { displayNumber, getPublicationsContent } from "@/lib/content";
import { InnerShell } from "@/app/_components/inner-shell";

const links = {
  primary: "text-sm font-medium text-[#96506f] hover:text-[#6f3a52]",
  secondary: "text-sm font-medium text-[#55454d] hover:text-[#34262d]",
};

export default async function Publications() {
  const { page, profile, items } = await getPublicationsContent();

  return (
    <InnerShell>
      <p className="editorial-kicker">{page.eyebrow}</p>
      <h1 className="editorial-title">
        {page.title}
        {page.titleMuted && (
          <>
            <br />
            <span className="editorial-title-muted">{page.titleMuted}</span>
          </>
        )}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[#55454d]">{page.intro}</p>

      <div className="mt-10 divide-y divide-[#ddd5d6] border-y border-[#ddd5d6]">
        {items.map((p, i) => (
          <article key={p.id} className="py-9">
            <div className="grid gap-6 xl:grid-cols-[5rem_1fr_auto]">
              <span className="font-display text-xl text-[#cdbfc5]">{displayNumber(i)}</span>
              <div>
                <p className="editorial-kicker">{p.category}</p>
                <h2 className="mt-2 font-display text-xl font-medium leading-tight text-[#4a3440] md:text-2xl">
                  {p.links[0]?.url ? (
                    <a href={p.links[0].url} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#96506f]">
                      {p.title} <span className="text-base text-[#96506f]">↗</span>
                    </a>
                  ) : (
                    p.title
                  )}
                </h2>
                <p className="mt-3 text-sm text-[#7b6670]">{p.byline}</p>
                <p className="mt-5 max-w-3xl leading-7 text-[#55454d]">{p.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-sm border border-[#ddd5d6] px-3 py-1.5 text-xs text-[#55454d]">{t}</span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-[#7b6670]">{p.status}</span>
            </div>
            {p.links.length > 0 && (
              <div className="mt-7 flex gap-5 border-t border-[#ddd5d6] pt-5">
                {p.links.map((l) => (
                  <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className={links[l.variant]}>{l.label} ↗</a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="mt-12 border-l-2 border-[#96506f] bg-[#ece8e6]/75 p-7">
        <p className="editorial-kicker">{profile.heading}</p>
        <p className="mt-3 max-w-3xl leading-7 text-[#55454d]">{profile.text}</p>
      </div>
    </InnerShell>
  );
}
