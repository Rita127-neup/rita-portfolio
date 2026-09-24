export default function Contact() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          Contact
        </p>

        <h1 className="mt-6 text-5xl font-semibold">
          Let&apos;s connect.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          I&apos;m interested in research, computational biology, public
          health, data, and opportunities to learn and collaborate.
        </p>

        <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
          <h2 className="text-2xl font-semibold">
            Get in touch
          </h2>

          <p className="mt-4 text-slate-400">
            For research discussions, collaborations, or academic
            opportunities, feel free to reach out.
          </p>

          <a
            href="mailto:neupanereeta8@gmail.com"
            className="mt-8 inline-block rounded-full bg-cyan-400 px-6 py-3 font-semibold text-[#07111f]"
          >
            Email me →
          </a>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
          <h2 className="text-2xl font-semibold">
            Find me online
          </h2>

          <div className="mt-6 space-y-4">
            <a
              href="https://github.com/Rita127-neup"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-white/10 p-4 text-slate-300 hover:border-cyan-400/30"
            >
              GitHub ↗
            </a>

            <div className="rounded-2xl border border-white/10 p-4 text-slate-500">
              LinkedIn — coming soon
            </div>

            <div className="rounded-2xl border border-white/10 p-4 text-slate-500">
              Google Scholar — coming soon
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}