import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
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
        <nav className="sticky top-0 z-50 border-b border-[#f2c3d5] bg-[#fff8fb]/96 text-[#5b2c43] backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-[1.35rem] font-semibold tracking-[-0.03em]">
              {site.brandMark}<span className="text-[#e0679a]">.</span>
            </Link>

            <div className="hidden items-center gap-7 text-[0.78rem] font-medium uppercase tracking-[0.08em] md:flex">
              {site.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[#5b2c43]/72 transition hover:text-[#b83a74]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {site.navCta?.href && site.navCta?.label && (
              <Link
                href={site.navCta.href}
                className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#b83a74] transition hover:text-[#8f2a5a]"
              >
                {site.navCta.label} ↗
              </Link>
            )}
          </div>
        </nav>

        {children}

        <footer className="border-t border-[#f2c3d5] bg-[#fbdde8] px-6 py-8">
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
