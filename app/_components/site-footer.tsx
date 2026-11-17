import Link from "next/link";
import { SproutMark } from "@/app/_components/sprout-mark";

/**
 * The small print at the bottom of every page: one quiet line with the name in the display serif,
 * a little flower and "Made in Nepal" in small green capitals. On the right a tiny sprout is the
 * way into the owner login; it has no visible words, only a hover tip and a label for screen readers.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-[84rem] px-6 pb-10 pt-4">
      <div className="flex flex-col items-center gap-2 border-t border-[#d9e3dc] pt-6 sm:flex-row sm:justify-between">
        <p className="flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-1">
          <span className="font-display text-[0.95rem] text-[#4a3440]">© {year} Rita Neupane</span>
          <span aria-hidden="true" className="text-[0.8rem] text-[#d3a1b8]">
            ✿
          </span>
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#4f7459]">Made in Nepal</span>
        </p>
        <Link
          href="/admin/login"
          aria-label="Owner login"
          title="Owner login"
          className="rounded-full p-1 transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8f78] motion-safe:hover:-rotate-6 motion-safe:hover:scale-110"
        >
          <SproutMark className="h-8 w-8" />
        </Link>
      </div>
    </footer>
  );
}
