import Image from "next/image";

const projectArtwork: Record<string, string> = {
  "dengue-ewars": "/project-art/dengue-ewars.svg",
  "public-data-advocacy": "/project-art/public-data-advocacy.svg",
  "nepal-education-data-engine": "/project-art/nepal-education-data-engine.svg",
  "ecoli-amr": "/project-art/ecoli-amr.svg",
  "dengue-lens-nepal": "/project-art/dengue-lens-nepal.svg",
  "dengue-fever-nepal": "/project-art/dengue-fever-nepal.svg",
  "caffeine-consumption": "/project-art/caffeine-study-v5.svg",
  "health-prediction-models": "/project-art/health-models-v5.svg",
};

export function ProjectVisual({
  id,
  imageId,
  title,
  category,
  href,
  compact = false,
}: {
  id: string;
  imageId?: string | null;
  title: string;
  category: string;
  href?: string | null;
  compact?: boolean;
}) {
  const artwork = projectArtwork[id] ?? (imageId ? `/media/project/${id}?v=${imageId}` : undefined);

  const visual = (
    <div className={`grain group relative overflow-hidden bg-[#dcd4c2] ${compact ? "aspect-[16/7]" : "aspect-[16/9]"}`}>
      {artwork ? (
        <Image
          src={artwork}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#ddd3bd] via-[#f1eadb] to-[#cfc3a8]">
          <span className="font-display text-4xl text-[#9a742d]/30">{title.slice(0, 1)}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#171822]/80 via-[#171822]/10 to-transparent" />
      <div className={`absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 ${compact ? "p-3" : "p-4"}`}>
        <div>
          <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#e5c77e]">{category}</p>
          <p className="mt-1 max-w-xl font-display text-base leading-tight text-white md:text-lg">{title}</p>
        </div>
        <span className="shrink-0 text-[10px] text-white/75">Explore ↗</span>
      </div>
    </div>
  );

  if (!href) return visual;
  const external = href.startsWith("http://") || href.startsWith("https://");
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label={`Open ${title}`}>
      {visual}
    </a>
  );
}
