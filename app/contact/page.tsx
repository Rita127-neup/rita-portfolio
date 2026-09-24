import { getContactContent, getSiteSettings } from "@/lib/content";

export default async function Contact() {
  const [contact, site] = await Promise.all([
    getContactContent(),
    getSiteSettings(),
  ]);

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          {contact.eyebrow}
        </p>

        <h1 className="mt-6 text-5xl font-semibold">{contact.title}</h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          {contact.intro}
        </p>

        <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
          <h2 className="text-2xl font-semibold">{contact.emailCardTitle}</h2>

          <p className="mt-4 text-slate-400">{contact.emailCardText}</p>

          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-8 inline-block rounded-full bg-cyan-400 px-6 py-3 font-semibold text-[#07111f]"
          >
            {contact.emailButtonLabel}
          </a>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
          <h2 className="text-2xl font-semibold">{contact.socialCardTitle}</h2>

          <div className="mt-6 space-y-4">
            {site.socialLinks.map((social) =>
              social.url ? (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-white/10 p-4 text-slate-300 hover:border-cyan-400/30"
                >
                  {social.label} ↗
                </a>
              ) : (
                <div
                  key={social.label}
                  className="rounded-2xl border border-white/10 p-4 text-slate-500"
                >
                  {social.label} — coming soon
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
