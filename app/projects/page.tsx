import { getProjectsContent, displayNumber } from "@/lib/content";
import { WorkMark } from "@/app/_components/work-mark";

export default async function Projects() {
  const { page, items } = await getProjectsContent();
  const projects = items.filter((project) =>
    ["dengue-lens-nepal", "nepal-education-data-engine"].includes(project.id)
  );

  return (
    <main className="site-shell bg-dot-paper">
      <div className="page-wrap">
        <p className="editorial-kicker">{page.eyebrow}</p>
        <h1 className="editorial-title projects-page-title">
          {page.title}
          {page.titleMuted && <><br /><span className="editorial-title-muted">{page.titleMuted}</span></>}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#62676f]">{page.intro}</p>

        <div className="mt-16 border-y border-[#d7cdb9]">
          {projects.map((project, index) => (
            <article key={project.id} id={project.id} className="grid gap-6 border-b border-[#d7cdb9] py-9 last:border-b-0 md:grid-cols-[4rem_minmax(0,1fr)_13rem]">
              <span className="font-display text-2xl text-[#a5a397]">{displayNumber(index)}</span>
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <p className="editorial-kicker">{project.category}</p>
                  <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[#777b86]">{project.status}</span>
                </div>
                <div className="mt-3 flex items-center gap-3"><WorkMark kind={project.id === "dengue-lens-nepal" ? "web" : "data"} /><h2 className="max-w-3xl font-display text-2xl leading-tight md:text-3xl">{project.title}</h2></div>
                <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-[#62676f]">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[0.68rem] uppercase tracking-[0.12em] text-[#777b86]">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <aside className="flex flex-col gap-3 border-t border-[#e3dac8] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-1">
                {project.linkUrl && <a href={project.linkUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#9a742d] hover:text-[#72521c]">Open live project ↗</a>}
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#454a55] hover:text-[#9a742d]">Source code ↗</a>}
              </aside>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-6 text-[#777b86]">
          Research studies are listed separately, with their datasets, methods, and publication status.
        </p>
      </div>
    </main>
  );
}
