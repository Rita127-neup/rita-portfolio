import { displayNumber, getResearchContent } from "@/lib/content";

export default async function Research() {
  const { page, items } = await getResearchContent();

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          {page.eyebrow}
        </p>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
          {page.title}
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">
          {page.intro}
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-white/10 bg-[#0c1a2d] p-8 transition hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <p className="text-sm text-cyan-300">
                {displayNumber(index)} · {item.category}
              </p>

              <h2 className="mt-6 text-2xl font-semibold">{item.title}</h2>

              <p className="mt-5 leading-7 text-slate-400">{item.summary}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
