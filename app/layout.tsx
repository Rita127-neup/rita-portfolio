import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rita Neupane",
  description: "Portfolio of Rita Neupane",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteSettings();

  return (
    <html lang="en" className={`${manrope.variable} antialiased`}>
      <body className="min-h-screen bg-[#07111f] font-sans text-slate-100">
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight transition hover:text-cyan-300"
            >
              {site.brandMark}
              <span className="text-cyan-400">.</span>
            </Link>

            <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
              {site.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href={site.navCta.href}
              className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
            >
              {site.navCta.label}
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
