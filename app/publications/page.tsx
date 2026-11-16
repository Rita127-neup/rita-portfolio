import { getPublicationsContent } from "@/lib/content";
import { pageCopy, publicationStatus, researchCopy } from "@/lib/content/copy";
import { InnerShell } from "@/app/_components/inner-shell";

export const metadata = { title: "Publications" };

/**
 * A plain record: title, authorship, where each study actually stands, and the
 * link. The descriptions are on the Research page.
 */
export default async function Publications() {
  const { items } = await getPublicationsContent();

  return (
    <InnerShell>
      <h1 className="editorial-title">{pageCopy.publications.title}</h1>
      <p className="mt-5 max-w-[38rem] text-lg leading-8 text-[#55454d]">{pageCopy.publications.intro}</p>

      <ol className="mt-8">
        {items.map((item, index) => {
          const copy = researchCopy[item.id];
          const links = [...item.links, ...(copy?.extraLinks ?? [])].filter(
            (link, i, all) => link.url && all.findIndex((other) => other.url === link.url) === i,
          );
          return (
            <li key={item.id} className="flex gap-5 border-t border-[#ddd5d6] py-7 first:border-t-0 first:pt-2">
              <span aria-hidden="true" className="w-6 shrink-0 pt-1 font-display text-lg text-[#8fb09a]">
                {index + 1}.
              </span>
              <div className="min-w-0 max-w-[38rem]">
                <h2 className="font-display text-[1.15rem] font-medium leading-snug text-[#4a3440]">
                  {copy?.title ?? item.title}
                </h2>
                {copy?.byline && <p className="mt-1.5 text-sm leading-6 text-[#7b6670]">Rita Neupane · {copy.byline}</p>}
                <p className="mt-2 inline-block rounded-full bg-[#e6efe8] px-3 py-0.5 text-xs text-[#3f6450]">
                  {publicationStatus[item.id] ?? item.status}
                </p>
                {links.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    {links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block py-1 text-[#96506f] underline underline-offset-4 transition-colors hover:text-[#6f3a52]"
                      >
                        {link.label.replace(/\s*→\s*$/, "")} ↗
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </InnerShell>
  );
}
