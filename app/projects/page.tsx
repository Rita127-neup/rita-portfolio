import { getProjectsContent } from "@/lib/content";
import { pageCopy, projectCopy, researchProjectSlugs } from "@/lib/content/copy";
import { InnerShell } from "@/app/_components/inner-shell";
import { WorkEntry, type EntryLink } from "@/app/_components/work-entry";

export const metadata = { title: "Projects" };

export default async function Projects() {
  const { items } = await getProjectsContent();
  // Research studies are described once, on the Research page.
  const projects = items.filter((project) => !researchProjectSlugs.includes(project.id));

  return (
    <InnerShell>
      <h1 className="editorial-title">{pageCopy.projects.title}</h1>
      <p className="mt-5 max-w-[38rem] text-lg leading-8 text-[#55454d]">{pageCopy.projects.intro}</p>

      <div className="mt-8">
        {projects.map((project) => {
          const copy = projectCopy[project.id];
          const sourceUrl = copy?.sourceUrl ?? project.githubUrl;
          const links: EntryLink[] = [];
          if (project.linkUrl) links.push({ label: "Live project", url: project.linkUrl });
          if (sourceUrl) links.push({ label: "Source code", url: sourceUrl });

          return (
            <WorkEntry
              key={project.id}
              id={project.id}
              kicker={copy?.kicker ?? project.category}
              title={copy?.title ?? project.title}
              lines={[copy?.role ? `Role: ${copy.role}` : "", copy?.status ?? project.status].filter(Boolean)}
              contribution={copy?.contribution}
              tags={project.tags}
              links={links}
            >
              {(copy?.paragraphs ?? [project.description]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </WorkEntry>
          );
        })}
      </div>
    </InnerShell>
  );
}
