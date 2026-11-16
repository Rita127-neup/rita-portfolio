import { SectionShell } from "@/app/_components/section-shell";
import type { Testimonial } from "@/lib/content/testimonials";

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <SectionShell id="testimonials" title="Testimonials">
      {items.map((item) => (
        <article key={item.id} className="pb-3">
          <h3 className="mb-2 mt-4 font-display text-xl font-medium leading-tight text-[#4a3440]">{item.name}</h3>
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#ddd5d6] bg-[#ebe8e2] font-display text-lg text-[#96506f]"
            >
              {initialsOf(item.name)}
            </div>
            <div className="min-w-0">
              {item.role && <p className="text-xs uppercase tracking-[0.1em] text-[#7b6670]">{item.role}</p>}
              {item.quote ? (
                <blockquote className="mt-2 leading-7 text-[#2b2026]">“{item.quote}”</blockquote>
              ) : (
                <p className="mt-2 italic leading-7 text-[#7b6670]">Testimonial to be added.</p>
              )}
            </div>
          </div>
        </article>
      ))}
    </SectionShell>
  );
}
