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
      className="fixed bottom-4 right-4 z-40 flex h-8 w-8 items-center justify-center rounded-full border border-[#f2c3d5] bg-[#fff8fb]/80 text-xs text-[#b83a74] backdrop-blur-md transition hover:border-[#b83a74]/50 hover:text-[#8f2a5a]"
    >
      <span aria-hidden="true">⌕</span>
    </Link>
  );
}
