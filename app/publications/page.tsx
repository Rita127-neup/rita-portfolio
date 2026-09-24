import { displayNumber, getPublicationsContent } from "@/lib/content";

const linkStyles = {
  primary: "text-sm font-medium text-cyan-300 transition hover:text-cyan-200",
  secondary: "text-sm font-medium text-slate-400 transition hover:text-white",
};

export default async function Publications() {
  const { page, profile, items: publications } = await getPublicationsContent();

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            {page.eyebrow}
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            {page.title}
            {page.titleMuted && (
              <>
                <br />
                <span className="text-slate-400">{page.titleMuted}</span>
              </>
            )}
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-400">{page.intro}</p>
        </div>

        <div className="mt-20 space-y-8">
          {publications.map((publication, index) => (
            <article
              key={publication.id}
              className="group rounded-[2rem] border border-white/10 bg-[#0c1a2d] p-8 transition duration-300 hover:border-cyan-400/30 md:p-10"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-4xl">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                    {displayNumber(index)} · {publication.category}
                  </p>

                  <h2 className="mt-5 text-2xl font-semibold leading-tight md:text-3xl">
                    {publication.title}
                  </h2>

                  <p className="mt-4 text-slate-400">{publication.byline}</p>

                  <p className="mt-6 leading-7 text-slate-400">
                    {publication.summary}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {publication.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs text-slate-500">
                  {publication.status}
                </span>
              </div>

              {publication.links.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-7">
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

        <div className="mt-16 rounded-[2rem] border border-cyan-400/10 bg-cyan-400/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            {profile.heading}
          </p>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            {profile.text}
          </p>
        </div>
      </div>
    </main>
  );
}
