import { getContactContent, getSiteSettings } from "@/lib/content";
import { InnerShell } from "@/app/_components/inner-shell";

export const metadata = { title: "Contact" };

/** Social links are on the profile card beside every page, so they are not repeated here. */
export default async function Contact() {
  const [c, s] = await Promise.all([getContactContent(), getSiteSettings()]);

  return (
    <InnerShell>
      <h1 className="editorial-title">{c.title}</h1>
      <p className="mt-5 max-w-[38rem] text-lg leading-8 text-[#55454d]">{c.intro}</p>
      {c.emailCardText && <p className="mt-6 max-w-[38rem] leading-7 text-[#55454d]">{c.emailCardText}</p>}
      {s.contactEmail && (
        <a
          href={`mailto:${s.contactEmail}`}
          className="mt-6 inline-block break-all py-1 font-display text-xl text-[#96506f] underline decoration-[#96506f]/30 underline-offset-8 transition-colors hover:text-[#6f3a52] md:text-2xl"
        >
          {s.contactEmail}
        </a>
      )}
    </InnerShell>
  );
}
