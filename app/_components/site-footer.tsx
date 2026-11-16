import Link from "next/link";

/**
 * The small print at the bottom of every page: one quiet line with the name in the display serif,
 * a little flower and "Made in Nepal" in small green capitals. The owner login sits on the right.
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
          className="rounded-full px-2 py-1 text-[0.8rem] text-[#7b6670] transition-colors hover:text-[#3f6450] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8f78]"
        >
          Owner login
        </Link>
      </div>
    </footer>
  );
}
