import { getAboutContent } from "@/lib/content";
import { aboutCopy, pageCopy } from "@/lib/content/copy";
import { InnerShell } from "@/app/_components/inner-shell";

export default async function About() {
  const { education } = await getAboutContent();
  const [lead, ...rest] = aboutCopy.paragraphs;

  return (
    <InnerShell>
      <h1 className="editorial-title">{pageCopy.about.title}</h1>

      <div className="mt-8 max-w-[38rem]">
        <p className="font-display text-xl leading-9 text-[#4a3440]">{lead}</p>
        <div className="mt-6 space-y-5 leading-[1.8] text-[#55454d]">
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      {education.length > 0 && (
        <section className="mt-12 max-w-[38rem] border-t border-[#ddd5d6] pt-6">
          <h2 className="editorial-kicker">Education</h2>
          <ol className="mt-5 space-y-5">
            {education.map((item) => (
              <li key={`${item.school}-${item.years}`}>
                <p className="font-display text-lg font-medium leading-snug text-[#4a3440]">{item.school}</p>
                <p className="mt-0.5 text-sm leading-6 text-[#7b6670]">
                  {[item.detail, item.years].filter(Boolean).join(" · ")}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </InnerShell>
  );
}
