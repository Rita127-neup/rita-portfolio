import { getAboutContent } from "@/lib/content";

export default async function About() {
  const a = await getAboutContent();

  return (
    <main className="site-shell bg-dot-paper">
      <div className="page-wrap">
        <p className="editorial-kicker">{a.eyebrow}</p>
        <h1 className="editorial-title">{a.title}</h1>

        <div className="mt-12 grid gap-10 border-t border-[#d7cdb9] pt-10 md:grid-cols-[0.45fr_1fr]">
          <p className="text-xs uppercase tracking-[0.18em] text-[#777b86]">
            A little about me
          </p>
          <p className="max-w-3xl font-display text-2xl leading-[1.45] tracking-[-0.02em] md:text-3xl">
            {a.body}
          </p>
        </div>

        <section className="mt-24 border-t border-[#d7cdb9] pt-10">
          <div className="grid gap-10 md:grid-cols-[0.45fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#777b86]">
                Education
              </p>
              <p className="mt-3 text-sm text-[#9a742d]">Academic background</p>
            </div>

            <div className="space-y-10">
              <article className="grid gap-3 border-b border-[#d7cdb9] pb-8 md:grid-cols-[1fr_auto] md:gap-8">
                <div>
                  <h2 className="font-display text-2xl leading-tight md:text-3xl">
                    Tilottama College / Tilottama Secondary School
                  </h2>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#777b86]">
                    Biology • Grades 11–12
                  </p>
                </div>
                <p className="text-sm text-[#777b86] md:text-right">2023–2025</p>
              </article>

              <article className="grid gap-3 md:grid-cols-[1fr_auto] md:gap-8">
                <div>
                  <h2 className="font-display text-2xl leading-tight md:text-3xl">
                    Jaycees Boarding Secondary School
                  </h2>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#777b86]">
                    Secondary Education • SEE
                  </p>
                </div>
                <p className="text-sm text-[#777b86] md:text-right">Completed</p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
