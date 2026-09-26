import { getAboutContent } from "@/lib/content";

export default async function About() {
  const about = await getAboutContent();

  return (
    <main className="min-h-screen bg-[#f7f1df] px-6 py-16 md:py-20 text-[#202033]">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#9a742d]">
          {about.eyebrow}
        </p>

        <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-[-0.045em] md:text-7xl">
          {about.title}
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-[#5e6270]">
          {about.body}
        </p>
      </div>
    </main>
  );
}
