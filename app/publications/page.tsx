import { displayNumber, getPublicationsContent } from "@/lib/content";

const linkStyles = {
  primary: "text-sm font-medium text-[#315c4a] transition hover:text-[#264b3d]",
  secondary: "text-sm font-medium text-[#5f665f] transition hover:text-[#171917]",
};

export default async function Publications() {
  const { page, profile, items: publications } = await getPublicationsContent();

  return (
    <main className="min-h-screen bg-[#f7f8f7] px-6 py-16 md:py-20 text-[#171917]">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#315c4a]">
            {page.eyebrow}
          </p>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-[-0.045em] md:text-7xl">
            {page.title}
            {page.titleMuted && (
              <>
                <br />
                <span className="text-[#5f665f]">{page.titleMuted}</span>
              </>
            )}
          </h1>

          <p className="mt-8 text-lg leading-8 text-[#5f665f]">{page.intro}</p>
        </div>

        <div className="mt-14 md:mt-12 md:mt-14 space-y-8">
          {publications.map((publication, index) => (
            <article
              key={publication.id}
              className="group rounded-2xl border border-[#dfe3df] bg-white p-8 transition duration-300 hover:border-[#315c4a]/30 md:p-10"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-4xl">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#315c4a]">
                    {displayNumber(index)} · {publication.category}
                  </p>

                  <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] leading-tight md:text-3xl">
                    {publication.title}
                  </h2>

                  <p className="mt-4 text-[#5f665f]">{publication.byline}</p>

                  <p className="mt-6 leading-7 text-[#5f665f]">
                    {publication.summary}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {publication.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#dfe3df] px-3 py-1.5 text-xs text-[#5f665f]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-[#dfe3df] px-4 py-2 text-xs text-[#7a817a]">
                  {publication.status}
                </span>
              </div>

              {publication.links.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-4 border-t border-[#dfe3df] pt-7">
                  {publication.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkStyles[link.variant]}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-12 md:mt-14 rounded-2xl border border-[#315c4a]/15 bg-[#eef2ef] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[#315c4a]">
            {profile.heading}
          </p>

          <p className="mt-4 max-w-3xl leading-7 text-[#5f665f]">
            {profile.text}
          </p>
        </div>
      </div>
    </main>
  );
}
