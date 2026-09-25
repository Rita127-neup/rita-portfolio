import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import OwnerLoginButton from "@/app/_components/owner-login-button";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rita Neupane",
  description: "Portfolio of Rita Neupane",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings();

  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen bg-[#f7f5f0] font-sans text-[#171717]">
        <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f5f0]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-xl font-semibold tracking-tight">
              {site.brandMark}<span className="text-[#9a6b3f]">.</span>
            </Link>
            <div className="hidden items-center gap-7 text-sm text-black/55 md:flex">
              {site.navigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-black">
                  {item.label}
                </Link>
              ))}
            </div>
            {site.navCta?.href && site.navCta?.label && (
              <Link href={site.navCta.href} className="text-sm font-medium text-[#7b5330] hover:text-black">
                {site.navCta.label} ↗
              </Link>
            )}
          </div>
        </nav>
        {children}
        <OwnerLoginButton />
      </body>
    </html>
  );
}
