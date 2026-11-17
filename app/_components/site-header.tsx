import Link from "next/link";
import { DnaMark } from "@/app/_components/dna-mark";
import { HeaderOrnament } from "@/app/_components/header-ornament";
import { NavLinks } from "@/app/_components/nav-links";

type NavItem = { label: string; href: string };

/**
 * The top of every public page: the helix mark on the left, the menu on the right and a small
 * flower-and-leaves ornament in the gap between them.
 * On a phone the three stack: the mark, the ornament, then the menu, whose links wrap.
 */
export function SiteHeader({ items }: { items: NavItem[] }) {
  return (
    <header className="mx-auto flex w-full max-w-[84rem] flex-col items-center gap-2 px-6 pb-2 pt-8 md:flex-row md:justify-between md:gap-0">
      <Link href="/" aria-label="Rita Neupane, home" title="Rita Neupane" className="transition-opacity hover:opacity-75">
        <DnaMark className="h-10 w-10" />
      </Link>
      <HeaderOrnament />
      <nav aria-label="Main" className="flex max-w-[20rem] flex-wrap items-center justify-center md:max-w-none md:justify-end">
        <NavLinks items={items} />
      </nav>
    </header>
  );
}
