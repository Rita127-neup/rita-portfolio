import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { NavLinks } from "@/app/_components/nav-links";
import OwnerLoginButton from "@/app/_components/owner-login-button";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rita Neupane",
  description: "Research, computational biology, public health, and data-driven work by Rita Neupane.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings();

  return (
    <html lang="en" className={`${nunito.variable} ${fraunces.variable} antialiased`}>
      <body>
        <nav className="sticky top-0 z-50 border-b border-[#f2c3d5] bg-[#fff8fb]/90 text-[#5b2c43] backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
            <Link href="/" className="font-display text-[1.45rem] font-semibold tracking-[-0.02em]">
              {site.brandMark}<span className="text-[#e0679a]">.</span>
            </Link>

            <div className="flex items-center gap-8">
              <div className="hidden items-center gap-7 text-[0.74rem] font-semibold uppercase tracking-[0.14em] md:flex">
                <NavLinks items={site.navigation} />
              </div>

              {site.navCta?.href && site.navCta?.label && (
                <Link
                  href={site.navCta.href}
                  className="hidden rounded-full border border-[#b83a74]/40 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#b83a74] transition hover:bg-[#fde6ee] sm:inline-block"
                >
                  {site.navCta.label} ↗
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto border-t border-[#f6d3e1] px-6 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] md:hidden">
            <NavLinks items={site.navigation} />
          </div>
        </nav>

        {children}

        <footer className="border-t border-[#f2c3d5] bg-[#fbdde8]/80 px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-[#8a5a72] md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Rita Neupane</span>
            <span>Research · Computational Biology · Data</span>
          </div>
        </footer>

        <OwnerLoginButton />
      </body>
    </html>
  );
}
