"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

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
            className={`whitespace-nowrap px-2 py-1 transition-colors hover:text-[#6f3a52] ${
              active ? "text-[#6f3a52] underline decoration-[#96506f]/40 underline-offset-[6px]" : "text-[#96506f]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
