import Link from "next/link";
import { DnaMark } from "@/app/_components/dna-mark";
import { NavLinks } from "@/app/_components/nav-links";

type NavItem = { label: string; href: string };

/**
 * The top of every public page: the helix mark in a soft sage badge on the left and the menu
 * on the right. From tablet width up the menu floats in a pill; on a phone the links simply wrap.
 */
export function SiteHeader({ items }: { items: NavItem[] }) {
  return (
    <header className="mx-auto flex w-full max-w-[84rem] flex-col items-center gap-3 px-6 pb-3 pt-7 md:flex-row md:justify-between md:gap-6 md:pt-8">
      <Link
        href="/"
        aria-label="Rita Neupane, home"
        title="Rita Neupane"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/70 shadow-[0_8px_22px_-14px_rgba(63,100,80,0.6)] ring-1 ring-[#dfe8e1] transition-all hover:bg-[#e6efe8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8f78] motion-safe:hover:-translate-y-0.5"
      >
        <DnaMark className="h-8 w-8" />
      </Link>

      <nav
        aria-label="Main"
        className="flex flex-wrap items-center justify-center gap-1 md:justify-end md:rounded-full md:bg-white/65 md:p-1.5 md:shadow-[0_8px_22px_-14px_rgba(63,100,80,0.6)] md:ring-1 md:ring-[#dfe8e1]"
      >
        <NavLinks items={items} />
      </nav>
    </header>
  );
}
