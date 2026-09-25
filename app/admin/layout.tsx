import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  );
}
