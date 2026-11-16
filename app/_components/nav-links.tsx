"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

/**
 * The menu links: medium-weight sentence case, each a rounded pill.
 * The page you are on is filled with a soft sage; the others fill on hover.
 */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const path = item.href.split("#")[0] || "/";
        const active = path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[0.9rem] font-medium leading-5 tracking-[0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8f78] md:px-4 md:text-[0.95rem] ${
              active ? "bg-[#e6efe8] text-[#3f6450]" : "text-[#55454d] hover:bg-[#eef3ef] hover:text-[#3f6450]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
