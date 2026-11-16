"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

/**
 * The menu links: sentence case, medium weight, in plum. The page you are on turns green
 * and gets a small green dot underneath; the others turn green on hover.
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
            className={`relative whitespace-nowrap px-2.5 py-1.5 text-[0.9rem] font-medium tracking-[0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f8f78] md:px-3.5 md:text-[0.95rem] ${
              active
                ? "text-[#3f6450] after:absolute after:-bottom-px after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#6f8f78]"
                : "text-[#55454d] hover:text-[#3f6450]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
