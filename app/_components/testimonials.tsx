import Image from "next/image";
import { SectionShell } from "@/app/_components/section-shell";
import { TestimonialQuote } from "@/app/_components/testimonial-quote";
import type { Testimonial } from "@/lib/content";

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Kind words from people I have worked with, in their own words. An entry still waiting for its text shows a soft placeholder line. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <SectionShell id="testimonials" title="Kind words">
      <div className="space-y-5 pb-2 pt-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-[#eadfe3] bg-[#f8f1f4]/70 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e3d3da] bg-[#f1e4ea] font-display text-lg text-[#96506f]">
                {item.photoUrl ? (
                  <Image src={item.photoUrl} alt={item.name} width={112} height={112} unoptimized className="h-full w-full object-cover" />
                ) : (
                  <span aria-hidden="true">{initialsOf(item.name)}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-medium leading-tight text-[#4a3440]">{item.name}</h3>
                {item.role && <p className="mt-0.5 text-xs uppercase tracking-[0.08em] text-[#7b6670]">{item.role}</p>}
              </div>
            </div>
            <div className="mt-4">
              {item.quote ? (
                <TestimonialQuote text={item.quote} />
              ) : (
                <p className="text-sm italic leading-7 text-[#8b7a82]">Their words will appear here.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
