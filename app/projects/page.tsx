import { displayNumber, getProjectsContent } from "@/lib/content";
import { ProjectVisual } from "@/app/_components/project-visual";

export default async function Projects() {
  const { page, items: projects } = await getProjectsContent();
  return (
    <main className="site-shell bg-dot-paper">
      <div className="page-wrap">
        <p className="editorial-kicker">{page.eyebrow}</p>
        <h1 className="editorial-title">{page.title}<br /><span className="editorial-title-muted">{page.titleMuted}</span></h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[#62676f]">{page.intro}</p>
        <div className="mt-16 space-y-10">
          {projects.map((project,index)=>(
            <article id={project.id} key={project.id} className="editorial-card group overflow-hidden rounded-[1.5rem]">
              <ProjectVisual id={project.id} title={project.title} category={project.category} />
              <div className="grid gap-8 p-7 md:grid-cols-[5rem_1fr_auto] md:p-9">
                <span className="font-display text-2xl text-[#a5a397]">{displayNumber(index)}</span>
                <div><p className="text-xs uppercase tracking-[0.16em] text-[#777b86]">{project.status}</p><h2 className="mt-2 font-display text-3xl tracking-[-0.03em] md:text-4xl">{project.title}</h2><p className="mt-4 max-w-3xl leading-7 text-[#62676f]">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag=><span key={tag} className="rounded-full border border-[#d7cdb9] px-3 py-1.5 text-xs text-[#62676f]">{tag}</span>)}</div></div>
                <span className="self-start text-xs uppercase tracking-[0.14em] text-[#9a742d]">Explore ↗</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}