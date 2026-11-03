import type { SVGProps } from "react";

type MarkKind = "web" | "data" | "genomics" | "epidemiology" | "survey" | "signal";

const paths: Record<MarkKind, React.ReactNode> = {
  web: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M3.5 8.5h17M7 6.5h.01M10 6.5h.01M7 12h10M7 15.5h6" /></>,
  data: <><ellipse cx="12" cy="5.5" rx="8" ry="2.8" /><path d="M4 5.5v6c0 1.55 3.58 2.8 8 2.8s8-1.25 8-2.8v-6M4 11.5v6c0 1.55 3.58 2.8 8 2.8s8-1.25 8-2.8v-6" /></>,
  genomics: <><path d="M7 3.5c0 5.7 10 5.7 10 11.4M17 3.5c0 5.7-10 5.7-10 11.4M7 20.5c0-2.2 2.1-3.7 5-5.6 2.9 1.9 5 3.4 5 5.6M8.5 7h7M8.5 12h7M8.5 17h7" /></>,
  epidemiology: <><path d="M4 19.5V4.5M4 19.5h16M7 15l3-4 3 2 5-6" /><path d="M15 7h3v3" /></>,
  survey: <><rect x="6" y="4" width="12" height="17" rx="1.8" /><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6M9 17h3" /></>,
  signal: <><path d="M4 9a11 11 0 0 1 16 0M7 12a7 7 0 0 1 10 0M10 15a3 3 0 0 1 4 0M12 19h.01" /></>,
};

export function WorkMark({ kind }: { kind: MarkKind }) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d8cfbb] bg-[#fbf6e8] text-[#8c6c32]">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" className="h-[17px] w-[17px]">
        {paths[kind]}
      </svg>
    </span>
  );
}
