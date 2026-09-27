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
          <p className="max-w-3xl font-display text-lg leading-[1.6] tracking-[-0.01em] md:text-xl">
            {a.intro}
          </p>
        </div>


      </div>
    </main>
  );
}
