const projectImages: Record<string, string> = {
  "ecoli-amr": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=85",
  "dengue-lens-nepal": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b3f0?auto=format&fit=crop&w=1400&q=85",
  "dengue-fever-nepal": "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1400&q=85",
  "caffeine-consumption": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85",
  "health-prediction-models": "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1400&q=85",
};

export function ProjectVisual({ id, title, category, compact = false }: {
  id: string; title: string; category: string; compact?: boolean;
}) {
  const image = projectImages[id];
  return (
    <div className={`grain group relative overflow-hidden bg-[#dcd4c2] ${compact ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
      {image ? <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-[1.045]" /> : <div className="absolute inset-0 bg-[linear-gradient(135deg,#ddd3bd,#f1eadb_48%,#cfc3a8)]" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#171822]/72 via-[#171822]/8 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 md:p-6">
        <div><p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#e5c77e]">{category}</p><p className="mt-1 max-w-xl font-display text-lg leading-tight text-white md:text-2xl">{title}</p></div>
        <span className="shrink-0 text-xs text-white/65">View ↗</span>
      </div>
    </div>
  );
}
