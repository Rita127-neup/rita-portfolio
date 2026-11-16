import { getContactContent, getSiteSettings } from "@/lib/content";
import { InnerShell } from "@/app/_components/inner-shell";

export default async function Contact() {
  const [c, s] = await Promise.all([getContactContent(), getSiteSettings()]);

  return (
    <InnerShell>
      <p className="editorial-kicker">{c.eyebrow}</p>
      <h1 className="editorial-title">{c.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[#55454d]">{c.intro}</p>

      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <section className="editorial-card rounded-lg p-6">
          <p className="editorial-kicker">{c.emailCardTitle}</p>
          <p className="mt-4 leading-7 text-[#55454d]">{c.emailCardText}</p>
          <a href={`mailto:${s.contactEmail}`} className="mt-8 inline-block text-sm font-medium text-[#96506f] underline underline-offset-8">Email me →</a>
        </section>
        <section className="editorial-card rounded-lg p-6">
          <p className="editorial-kicker">{c.socialCardTitle}</p>
          <div className="mt-5 divide-y divide-[#ddd5d6] border-y border-[#ddd5d6]">
            {s.socialLinks.map((x) =>
              x.url ? (
                <a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer" className="block py-4 text-sm font-medium hover:text-[#96506f]">{x.label} ↗</a>
              ) : (
                <div key={x.label} className="py-4 text-sm text-[#7b6670]">{x.label} — coming soon</div>
              ),
            )}
          </div>
        </section>
      </div>
    </InnerShell>
  );
}
