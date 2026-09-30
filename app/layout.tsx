import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import OwnerLoginButton from "@/app/_components/owner-login-button";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rita Neupane",
  description: "Research, computational biology, public health, and data-driven work by Rita Neupane.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings();

  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} antialiased`}>
      <body>
        <nav className="sticky top-0 z-50 border-b border-[#4f5660] bg-[#596270]/96 text-[#f7f1df] backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-[1.35rem] font-semibold tracking-[-0.03em]">
              {site.brandMark}<span className="text-[#d0a14a]">.</span>
            </Link>

            <div className="hidden items-center gap-7 text-[0.78rem] font-medium uppercase tracking-[0.08em] md:flex">
              {site.navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[#f7f1df]/72 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {site.navCta?.href && site.navCta?.label && (
              <Link
                href={site.navCta.href}
                className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#f0c86a] transition hover:text-white"
              >
                {site.navCta.label} ↗
              </Link>
            )}
          </div>
        </nav>

        {children}

        <footer className="border-t border-[#d7cdb9] bg-[#ebe2cf] px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-[#777b86] md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Rita Neupane</span>
            <span>Research · Computational Biology · Data</span>
          </div>
        </footer>

        <OwnerLoginButton />
      </body>
    </html>
  );
}
