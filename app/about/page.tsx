import { getAboutContent } from "@/lib/content";
import { InnerShell } from "@/app/_components/inner-shell";

export default async function About() {
  const a = await getAboutContent();

  return (
    <InnerShell>
      <p className="editorial-kicker">{a.eyebrow}</p>
      <h1 className="editorial-title">{a.title}</h1>

      <div className="mt-10 border-t border-[#ddd5d6] pt-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[#7b6670]">A little about me</p>
        <p className="mt-4 max-w-3xl font-display text-lg leading-[1.7] tracking-[-0.01em] md:text-xl">{a.intro}</p>
      </div>
    </InnerShell>
  );
}
