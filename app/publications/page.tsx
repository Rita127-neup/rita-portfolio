import { displayNumber, getPublicationsContent } from "@/lib/content";

const linkStyles = {
  primary: "text-sm font-medium text-[#9a742d] transition hover:text-[#76571e]",
  secondary: "text-sm font-medium text-[#5e6270] transition hover:text-[#202033]",
};

export default async function Publications() {
  const { page, profile, items: publications } = await getPublicationsContent();

  return (
    <main className="min-h-screen bg-[#f7f1df] px-6 py-16 md:py-20 text-[#202033]">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#9a742d]">
            {page.eyebrow}
          </p>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-[-0.045em] md:text-7xl">
            {page.title}
            {page.titleMuted && (
              <>
                <br />
                <span className="text-[#5e6270]">{page.titleMuted}</span>
              </>
            )}
          </h1>

          <p className="mt-8 text-lg leading-8 text-[#5e6270]">{page.intro}</p>
        </div>

        <div className="mt-14 md:mt-12 md:mt-14 space-y-8">
          {publications.map((publication, index) => (
            <article
              key={publication.id}
              className="group rounded-2xl border border-[#d8cfbb] bg-[#fbf6e8] p-8 transition duration-300 hover:border-[#9a742d]/30 md:p-10"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-4xl">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#9a742d]">
                    {displayNumber(index)} · {publication.category}
                  </p>

                  <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] leading-tight md:text-3xl">
                    {publication.title}
                  </h2>

                  <p className="mt-4 text-[#5e6270]">{publication.byline}</p>

                  <p className="mt-6 leading-7 text-[#5e6270]">
                    {publication.summary}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {publication.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#d8cfbb] px-3 py-1.5 text-xs text-[#5e6270]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-[#d8cfbb] px-4 py-2 text-xs text-[#777b86]">
                  {publication.status}
                </span>
              </div>

              {publication.links.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-4 border-t border-[#d8cfbb] pt-7">
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

        <div className="mt-12 md:mt-14 rounded-2xl border border-[#9a742d]/15 bg-[#eee7d4] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[#9a742d]">
            {profile.heading}
          </p>

          <p className="mt-4 max-w-3xl leading-7 text-[#5e6270]">
            {profile.text}
          </p>
        </div>
      </div>
    </main>
  );
}
