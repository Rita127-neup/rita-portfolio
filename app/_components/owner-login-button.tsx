"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OwnerLoginButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Link
      href="/admin/login"
      aria-label="Owner login"
      title="Owner login"
      className="fixed bottom-4 right-4 z-40 flex h-8 w-8 items-center justify-center rounded-full border border-[#ddd5d6] bg-[#f8f7f2]/80 text-xs text-[#96506f] backdrop-blur-md transition hover:border-[#96506f]/50 hover:text-[#6f3a52]"
    >
      <span aria-hidden="true">⌕</span>
    </Link>
  );
}
