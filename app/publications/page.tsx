export default function Publications() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            Publications
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Research in
            <br />
            <span className="text-slate-400">the public record.</span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-400">
            My published research has focused on public health, epidemiology,
            and data-driven investigation of health-related questions in Nepal.
          </p>
        </div>

        <div className="mt-20 space-y-8">
          {/* Publication 1 */}
          <article className="group rounded-[2rem] border border-white/10 bg-[#0c1a2d] p-8 transition duration-300 hover:border-cyan-400/30 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-4xl">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                  01 · Public Health
                </p>

                <h2 className="mt-5 text-2xl font-semibold leading-tight md:text-3xl">
                  Caffeine Consumption Patterns Among Adults in
                  Siddharthanagar-09, Bhairahawa, Nepal
                </h2>

                <p className="mt-4 text-slate-400">
                  First author · Community-based survey research
                </p>

                <p className="mt-6 leading-7 text-slate-400">
                  A community-based study examining caffeine consumption
                  patterns, sources, motivations, and related behaviors among
                  adults in Siddharthanagar-09, Bhairahawa.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    "Survey Research",
                    "Public Health",
                    "Data Analysis",
                    "Nepal",
                  ].map((tag) => (
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
                Published
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-7">
              <a
                href="https://doi.org/10.5281/zenodo.21785947"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                View research record →
              </a>
            </div>
          </article>

          {/* Publication 2 */}
          <article className="group rounded-[2rem] border border-white/10 bg-[#0c1a2d] p-8 transition duration-300 hover:border-cyan-400/30 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-4xl">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                  02 · Epidemiology
                </p>

                <h2 className="mt-5 text-2xl font-semibold leading-tight md:text-3xl">
                  Dengue Fever in Nepal: Temporal Patterns and Environmental
                  Associations
                </h2>

                <p className="mt-4 text-slate-400">
                  First author · National surveillance data analysis
                </p>

                <p className="mt-6 leading-7 text-slate-400">
                  An analysis of national dengue surveillance data from Nepal
                  covering 2019–2024, investigating temporal patterns and
                  relationships between dengue cases and environmental
                  variables.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    "Epidemiology",
                    "Dengue",
                    "Surveillance Data",
                    "Nepal",
                  ].map((tag) => (
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
                Published
              </span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 border-t border-white/10 pt-7">
              <a
                href="https://doi.org/10.5281/zenodo.21773367"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                View research record →
              </a>

              <a
                href="https://doi.org/10.5281/zenodo.21773367"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-400 transition hover:text-white"
              >
                Dataset / repository →
              </a>
            </div>
          </article>
        </div>

        <div className="mt-16 rounded-[2rem] border border-cyan-400/10 bg-cyan-400/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
            Research profile
          </p>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Alongside these publications, I am currently developing a
            computational antimicrobial-resistance study using genomic data
            and machine learning.
          </p>
        </div>
      </div>
    </main>
  );
}