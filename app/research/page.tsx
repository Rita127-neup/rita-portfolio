import { displayNumber, getResearchContent } from "@/lib/content";

export default async function Research() {
 const {page,items}=await getResearchContent();
 return <main className="site-shell bg-dot-paper"><div className="page-wrap">
  <p className="editorial-kicker">{page.eyebrow}</p><h1 className="editorial-title">{page.title}</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-[#62676f]">{page.intro}</p>
  <div className="mt-16 divide-y divide-[#d7cdb9] border-y border-[#d7cdb9]">{items.map((item,i)=><article key={item.id} className="grid gap-5 py-8 md:grid-cols-[5rem_0.65fr_1fr]"><span className="font-display text-2xl text-[#a5a397]">{displayNumber(i)}</span><div><p className="editorial-kicker">{item.category}</p><h2 className="mt-2 font-display text-2xl tracking-[-0.02em]">{item.title}</h2></div><div><p className="leading-7 text-[#62676f]">{item.summary}</p><div className="mt-5 flex flex-wrap gap-2">{item.tags.map(tag=><span key={tag} className="rounded-full border border-[#d7cdb9] px-3 py-1.5 text-xs text-[#62676f]">{tag}</span>)}</div></div></article>)}</div>
 </div></main>;
}