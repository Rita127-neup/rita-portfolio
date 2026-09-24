export default function Home() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#07111f] text-slate-100">
      <section className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 py-24 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
              Researcher · Computational Biology · Data
            </p>

            <h1 className="text-6xl font-semibold leading-none tracking-tight md:text-8xl">
              Rita
              <br />
              <span className="text-slate-400">Neupane.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
              I investigate biological and public-health questions through
              computation, data, and research.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/research"
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300"
              >
                Explore my research
              </a>

              <a
                href="/about"
                className="rounded-full border border-white/15 px-6 py-3 text-sm text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                Get to know me
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] border border-cyan-400/10" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1a2d]">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/5 text-3xl font-semibold text-cyan-300">
                    RN
                  </div>

                  <p className="mt-5 text-sm text-slate-500">
                    Photograph coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}