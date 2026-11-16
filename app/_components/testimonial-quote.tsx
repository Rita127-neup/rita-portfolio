"use client";

import { useState } from "react";

/** The person's own words. A long letter starts folded to a few lines. */
export function TestimonialQuote({ text }: { text: string }) {
  const long = text.length > 420;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className={`whitespace-pre-line leading-7 text-[#3d2f36] ${long && !open ? "line-clamp-5" : ""}`}>{text}</p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="mt-2 text-sm text-[#96506f] underline underline-offset-4 transition-colors hover:text-[#6f3a52]"
        >
          {open ? "Show less" : "Read the full note"}
        </button>
      )}
    </div>
  );
}
