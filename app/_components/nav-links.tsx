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
            className={`whitespace-nowrap border-b-2 pb-1 transition ${active ? "border-[#b83a74] text-[#b83a74]" : "border-transparent text-[#5b2c43]/75 hover:text-[#b83a74]"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
