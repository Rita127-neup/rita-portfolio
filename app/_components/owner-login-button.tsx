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
      className="fixed bottom-4 right-4 z-40 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#07111f]/70 text-xs text-slate-500 backdrop-blur-md transition hover:border-cyan-400/40 hover:text-cyan-300"
    >
      <span aria-hidden="true">⌕</span>
    </Link>
  );
}
