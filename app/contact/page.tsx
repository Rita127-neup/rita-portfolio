import { getContactContent, getSiteSettings } from "@/lib/content";

export default async function Contact() {
  const [contact, site] = await Promise.all([
    getContactContent(),
    getSiteSettings(),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f1df] px-6 py-16 md:py-20 text-[#202033]">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#9a742d]">
          {contact.eyebrow}
        </p>

        <h1 className="mt-6 font-display text-5xl font-bold tracking-[-0.045em]">{contact.title}</h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#5e6270]">
          {contact.intro}
        </p>

        <div className="mt-12 rounded-2xl border border-[#d8cfbb] bg-[#fbf6e8] p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">{contact.emailCardTitle}</h2>

          <p className="mt-4 text-[#5e6270]">{contact.emailCardText}</p>

          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-8 inline-block rounded-full bg-[#9a742d] px-6 py-3 font-semibold text-white"
          >
            {contact.emailButtonLabel}
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-[#d8cfbb] bg-[#fbf6e8] p-8">
          <h2 className="text-2xl font-semibold tracking-[-0.02em]">{contact.socialCardTitle}</h2>

          <div className="mt-6 space-y-4">
            {site.socialLinks.map((social) =>
              social.url ? (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-[#d8cfbb] p-4 text-slate-300 hover:border-[#9a742d]/30"
                >
                  {social.label} ↗
                </a>
              ) : (
                <div
                  key={social.label}
                  className="rounded-2xl border border-[#d8cfbb] p-4 text-[#777b86]"
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
