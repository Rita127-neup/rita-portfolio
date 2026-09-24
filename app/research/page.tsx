export default function Research() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          Research
        </p>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
          Research
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">
          My research uses computation, biological data, and statistical
          analysis to investigate questions in antimicrobial resistance and
          public health.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-[#0c1a2d] p-8 transition hover:-translate-y-1 hover:border-cyan-400/30">
            <p className="text-sm text-cyan-300">01 · AMR / MACHINE LEARNING</p>

            <h2 className="mt-6 text-2xl font-semibold">
              Geographic generalization and calibration of E. coli resistance
              prediction
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              A computational study of genomic prediction for ciprofloxacin
              resistance in E. coli, examining how model discrimination and
              calibration change across geographic populations.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                Antimicrobial resistance
              </span>

              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                Machine learning
              </span>

              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                Genomics
              </span>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-[#0c1a2d] p-8 transition hover:-translate-y-1 hover:border-cyan-400/30">
            <p className="text-sm text-cyan-300">02 · PUBLIC HEALTH</p>

            <h2 className="mt-6 text-2xl font-semibold">
              Dengue Fever in Nepal
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Analysis of national dengue surveillance data from Nepal to
              investigate temporal patterns and relationships between dengue
              cases and environmental variables.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                Epidemiology
              </span>

              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                Public health
              </span>

              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                Nepal
              </span>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}