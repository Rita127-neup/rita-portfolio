import type { Metadata } from "next";
import { Commissioner, Fraunces } from "next/font/google";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { NavLinks } from "@/app/_components/nav-links";
import OwnerLoginButton from "@/app/_components/owner-login-button";
import "./globals.css";

const commissioner = Commissioner({ variable: "--font-commissioner", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rita Neupane",
  description: "Research, computational biology, public health, and data-driven work by Rita Neupane.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteSettings();

  // Publications and Research are one page now (/research), so a stored "Publications" entry points there.
  const merged = site.navigation.map((item) => (item.href === "/publications" ? { label: "Research", href: "/research" } : item));
  const unique = merged.filter((item, index) => merged.findIndex((other) => other.href === item.href) === index);
  const menuOrder = ["/about", "/research", "/projects", "/contact"];
  const rank = (href: string) => (menuOrder.indexOf(href) === -1 ? menuOrder.length : menuOrder.indexOf(href));
  const menu = [...unique].sort((a, b) => rank(a.href) - rank(b.href));

  // The call-to-action link from site settings is shown as one more nav item, unless the menu already has it.
  const cta = site.navCta?.href && site.navCta?.label ? site.navCta : null;
  const navItems = cta && !menu.some((item) => item.href === cta.href) ? [...menu, cta] : menu;

  return (
    <html lang="en" className={`${commissioner.variable} ${fraunces.variable} antialiased`}>
      <body>
        <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-6 pb-2 pt-8 md:flex-row md:justify-between">
          <Link href="/" className="font-display text-[1.35rem] font-medium tracking-[-0.01em] text-[#4a3440]">
            {site.brandMark}
          </Link>
          <nav aria-label="Main" className="flex flex-wrap items-center justify-center text-[0.75rem] uppercase tracking-[0.06em] md:justify-end md:text-[0.8rem] md:tracking-[0.1em]">
            <NavLinks items={navItems} />
          </nav>
        </header>

        {children}

        <footer className="mx-auto w-full max-w-5xl px-6 pb-10 pt-4">
          <div className="flex flex-col gap-1 border-t border-[#ddd5d6] pt-6 text-xs text-[#7b6670] md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Rita Neupane</span>
            <span>Research · Computational Biology · Data</span>
          </div>
        </footer>

        <OwnerLoginButton />
      </body>
    </html>
  );
}
