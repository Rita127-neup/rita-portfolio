import { getAboutContent } from "@/lib/content";

export default async function About() {
  const about = await getAboutContent();

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          {about.eyebrow}
        </p>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
          {about.title}
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">
          {about.intro}
        </p>
      </div>
    </main>
  );
}
