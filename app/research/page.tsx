import { getPublicationsContent } from "@/lib/content";
import { pageCopy, researchCopy } from "@/lib/content/copy";
import { InnerShell } from "@/app/_components/inner-shell";
import { WorkEntry } from "@/app/_components/work-entry";

export const metadata = { title: "Research" };

/**
 * Every study appears here once, with its status and links. This page also
 * covers what used to be a separate Publications page.
 */
export default async function Research() {
  const { items } = await getPublicationsContent();

  return (
    <InnerShell>
      <h1 className="editorial-title">{pageCopy.research.title}</h1>
      <p className="mt-5 max-w-[38rem] text-lg leading-8 text-[#55454d]">{pageCopy.research.intro}</p>

      <div className="mt-8">
        {items.map((item) => {
          const copy = researchCopy[item.id];
          // The stored links plus any added in the copy, without showing the same address twice.
          const links = [...item.links, ...(copy?.extraLinks ?? [])].filter(
            (link, index, all) => link.url && all.findIndex((other) => other.url === link.url) === index,
          );

          return (
            <WorkEntry
              key={item.id}
              id={item.id}
              kicker={copy?.kicker ?? item.category}
              title={copy?.title ?? item.title}
              lines={[copy?.byline ?? item.byline, copy?.status ?? item.status].filter(Boolean)}
              contribution={copy?.contribution}
              links={links}
            >
              {(copy?.paragraphs ?? [item.summary]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </WorkEntry>
          );
        })}
      </div>
    </InnerShell>
  );
}
