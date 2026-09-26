import Image from "next/image";

export function ProjectVisual({
  id,
  imageId,
  title,
  category,
  compact = false,
}: {
  id: string;
  imageId?: string | null;
  title: string;
  category: string;
  compact?: boolean;
}) {
  return (
    <div className={`grain group relative overflow-hidden bg-[#dcd4c2] ${compact ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
      {imageId ? (
        <Image
          src={`/media/project/${id}?v=${imageId}`}
          alt={title}
          fill
          unoptimized
          className="object-cover transition duration-700 group-hover:scale-[1.045]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#ddd3bd] via-[#f1eadb] to-[#cfc3a8]">
          <span className="font-display text-5xl text-[#9a742d]/30">{title.slice(0, 1)}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#171822]/75 via-[#171822]/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-6">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#e5c77e]">{category}</p>
          <p className="mt-1 max-w-xl font-display text-lg leading-tight text-white md:text-2xl">{title}</p>
        </div>
        <span className="shrink-0 text-xs text-white/65">View ↗</span>
      </div>
    </div>
  );
}
