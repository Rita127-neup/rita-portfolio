/** Plain-text post body: blank line = new paragraph, a line starting with ## = heading. No HTML is ever interpreted. */
export function PostBody({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className="max-w-[44rem] space-y-5 leading-[1.85] text-[#55454d]">
      {blocks.map((block, index) =>
        block.startsWith("## ") ? (
          <h2 key={index} className="pt-3 font-display text-xl font-medium text-[#4a3440]">
            {block.slice(3)}
          </h2>
        ) : (
          <p key={index} className="whitespace-pre-line">{block}</p>
        ),
      )}
    </div>
  );
}
