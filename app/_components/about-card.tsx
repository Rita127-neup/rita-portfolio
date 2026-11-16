import type { NoteItem } from "@/lib/content";

/**
 * A soft green card that sits beside the biography: the languages I know and
 * what I like doing. The dashed edge is a nod to stitching.
 */
export function AboutCard({ languages, hobbies }: { languages: NoteItem[]; hobbies: NoteItem[] }) {
  if (languages.length === 0 && hobbies.length === 0) return null;

  return (
    <aside className="h-fit rounded-3xl border border-dashed border-[#a9c4b1] bg-[#eef4ef]/80 p-5 @3xl:mt-2">
      {languages.length > 0 && (
        <div id="languages" className="scroll-mt-6">
          <h3 className="flex items-center gap-1.5 font-display text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#3f6450]">
            <span aria-hidden="true" className="text-[0.65rem] text-[#8fb09a]">✿</span> Languages
          </h3>
          <ul className="mt-3 space-y-2.5">
            {languages.map((item) => (
              <li key={item.title} className="leading-tight">
                <span className="font-display text-[1.02rem] text-[#4a3440]">{item.title}</span>
                {item.note && <span className="block text-[0.8rem] italic text-[#6c7f72]">{item.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hobbies.length > 0 && (
        <div id="hobbies" className={`scroll-mt-6 ${languages.length > 0 ? "mt-6 border-t border-dashed border-[#a9c4b1] pt-5" : ""}`}>
          <h3 className="flex items-center gap-1.5 font-display text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[#3f6450]">
            <span aria-hidden="true" className="text-[0.65rem] text-[#8fb09a]">✿</span> Hobbies
          </h3>
          <ul className="mt-3 space-y-2.5">
            {hobbies.map((item) => (
              <li key={item.title} className="flex gap-2 leading-tight">
                <span aria-hidden="true" className="mt-[0.15rem] text-[0.6rem] text-[#8fb09a]">❀</span>
                <span>
                  <span className="font-display text-[1.02rem] text-[#4a3440]">{item.title}</span>
                  {item.note && <span className="block text-[0.8rem] italic text-[#6c7f72]">{item.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
