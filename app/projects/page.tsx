import { getProjectsContent } from "@/lib/content";
import { ProjectVisual } from "@/app/_components/project-visual";

export default async function Projects() {
  const { page, items: projects } = await getProjectsContent();

  return (
    <main className="site-shell bg-dot-paper">
      <div className="page-wrap">
        <p className="editorial-kicker">{page.eyebrow}</p>
        <h1 className="editorial-title projects-page-title">
          {page.title}
          <br />
          <span className="editorial-title-muted">{page.titleMuted}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#62676f]">{page.intro}</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="group overflow-hidden rounded-2xl border border-[#d8cfbb] bg-[#fbf6e8] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(50,43,30,0.10)]"
            >
              <ProjectVisual
                id={project.id}
                imageId={project.imageId}
                title={project.title}
                category={project.category}
                href={project.linkUrl || project.githubUrl || undefined}
                compact
              />
              <div className="p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9a742d]">
                  {project.status}
                </p>
                <h2 className="mt-1.5 text-base font-semibold tracking-tight group-hover:text-[#9a742d]">
                  {project.title}
                </h2>
                <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[#666c78]">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#d7cdb9] px-2 py-0.5 text-[9px] text-[#62676f]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {(project.githubUrl || project.linkUrl) && (
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#e3dac8] pt-3">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#9a742d] hover:text-[#72521c]">
                        GitHub repository ↗
                      </a>
                    )}
                    {project.linkUrl && (
                      <a href={project.linkUrl} target="_blank" rel="noreferrer" className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#454a55] hover:text-[#9a742d]">
                        Live dashboard ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
