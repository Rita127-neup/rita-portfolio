import { displayNumber, getResearchContent } from "@/lib/content";

export default async function Research() {
  const { page, items } = await getResearchContent();

  return (
    <main className="min-h-screen bg-[#f7f8f7] px-6 py-16 md:py-20 text-[#171917]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#315c4a]">
          {page.eyebrow}
        </p>

        <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-[-0.045em] md:text-7xl">
          {page.title}
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-[#5f665f]">
          {page.intro}
        </p>

        <div className="mt-12 md:mt-14 grid gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#dfe3df] bg-white p-8 transition hover:-translate-y-1 hover:border-[#315c4a]/30"
            >
              <p className="text-sm text-[#315c4a]">
                {displayNumber(index)} · {item.category}
              </p>

              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">{item.title}</h2>

              <p className="mt-5 leading-7 text-[#5f665f]">{item.summary}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#dfe3df] px-3 py-1 text-xs text-[#5f665f]"
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
