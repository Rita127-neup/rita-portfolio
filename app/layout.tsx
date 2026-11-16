import type { Metadata } from "next";
import { Commissioner, Fraunces } from "next/font/google";
import { getAboutExtras, getSiteSettings } from "@/lib/content";
import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import "./globals.css";

const commissioner = Commissioner({ variable: "--font-commissioner", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Rita Neupane | Researcher in computational biology", template: "%s | Rita Neupane" },
  description: "Research, computational biology, public health, and data-driven work by Rita Neupane.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [site, extras] = await Promise.all([getSiteSettings(), getAboutExtras()]);

  // About now lives on the home page, so the menu goes straight to the other pages.
  // The blog link appears only once the blog has been switched on in the admin.
  const base = site.navigation.filter((item) => item.href !== "/about" && item.href !== "/blog");
  const visible = extras.blogEnabled ? [...base, { label: "Blog", href: "/blog" }] : base;
  const menuOrder = ["/research", "/publications", "/projects", "/gallery", "/blog", "/contact"];
  const rank = (href: string) => (menuOrder.indexOf(href) === -1 ? menuOrder.length : menuOrder.indexOf(href));
  const menu = [...visible].sort((a, b) => rank(a.href) - rank(b.href));

  // The call-to-action link from site settings is shown as one more nav item, unless the menu already has it.
  const cta = site.navCta?.href && site.navCta?.label ? site.navCta : null;
  const navItems = cta && !menu.some((item) => item.href === cta.href) ? [...menu, cta] : menu;

  return (
    <html lang="en" className={`${commissioner.variable} ${fraunces.variable} antialiased`}>
      <body>
        <SiteHeader items={navItems} />

        {children}

        <SiteFooter />
      </body>
    </html>
  );
}
