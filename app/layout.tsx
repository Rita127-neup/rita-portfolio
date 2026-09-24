import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rita Neupane | Research & Computational Biology",
  description:
    "Rita Neupane's portfolio featuring research, computational biology, public health, data science, and independent projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} antialiased`}>
      <body className="min-h-screen bg-[#07111f] font-sans text-slate-100">
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <a
              href="/"
              className="text-lg font-semibold tracking-tight transition hover:text-cyan-300"
            >
              RN<span className="text-cyan-400">.</span>
            </a>

            <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
              <a href="/about" className="transition hover:text-white">
                About
              </a>

              <a href="/research" className="transition hover:text-white">
                Research
              </a>

              <a href="/projects" className="transition hover:text-white">
                Projects
              </a>

              <a
                href="/publications"
                className="transition hover:text-white"
              >
                Publications
              </a>

              <a href="/contact" className="transition hover:text-white">
                Contact
              </a>
            </div>

            <a
              href="/contact"
              className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Let&apos;s connect
            </a>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}