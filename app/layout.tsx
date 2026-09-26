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
  description: "Portfolio of Rita Neupane",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings();

  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} antialiased`}>
      <body className="min-h-screen bg-[#f7f1df] font-sans text-[#202033]">
        <nav className="sticky top-0 z-50 border-b border-[#596270] bg-[#596270]/98 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-xl font-bold tracking-tight text-[#f7f1df]">
              {site.brandMark}<span className="text-[#c09238]">.</span>
            </Link>
            <div className="hidden items-center gap-7 text-sm text-[#f7f1df]/75 md:flex">
              {site.navigation.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-[#ffffff]">
                  {item.label}
                </Link>
              ))}
            </div>
            {site.navCta?.href && site.navCta?.label && (
              <Link href={site.navCta.href} className="text-sm font-semibold text-[#f0c86a] hover:text-black">
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
