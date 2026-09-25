import Image from "next/image";
import Link from "next/link";
import { getHomeContent, getOrganizations, getProfileInfo } from "@/lib/content";

export default async function Home() {
  const [home, profile, organizations] = await Promise.all([getHomeContent(), getProfileInfo(), getOrganizations()]);

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#07111f] text-slate-100">
      <section className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 py-24 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
              {home.eyebrow}
            </p>

            <h1 className="text-6xl font-semibold leading-none tracking-tight md:text-8xl">
              {home.firstName}
              <br />
              <span className="text-slate-400">{home.lastName}</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
              {home.intro}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={home.primaryCta.href}
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-cyan-300"
              >
                {home.primaryCta.label}
              </Link>

              <Link
                href={home.secondaryCta.href}
                className="rounded-full border border-white/15 px-6 py-3 text-sm text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                {home.secondaryCta.label}
              </Link>

              {home.cv && (
                <a
                  href={home.cv.href}
                  className="rounded-full border border-white/15 px-6 py-3 text-sm text-slate-300 transition hover:border-white/30 hover:text-white"
                >
                  {home.cv.label}
                </a>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] border border-cyan-400/10" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c1a2d]">
              {home.photoUrl ? (
                // Served from the private bucket via a signed-URL redirect,
                // so it bypasses the image optimizer.
                <Image
                  src={home.photoUrl}
                  alt={home.photoAlt}
                  fill
                  unoptimized
                  loading="eager"
                  sizes="(min-width: 768px) 28rem, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/5 text-3xl font-semibold text-cyan-300">
                      {home.photoPlaceholderInitials}
                    </div>

                    <p className="mt-5 text-sm text-slate-500">
                      {home.photoPlaceholderText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#07111f] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            Personal information
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Get to know me
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Email", profile.email, `mailto:${profile.email}`],
              ["Phone", profile.phone, `tel:${profile.phone.replace(/\s/g, "")}`],
              ["Birthday", profile.birthday, null],
              ["Location", profile.location, null],
            ].map(([label, value, href]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#0c1a2d] px-6 py-5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p>
                {href ? (
                  <a href={href} className="mt-2 block break-words text-base text-slate-200 transition hover:text-cyan-300">{value}</a>
                ) : (
                  <p className="mt-2 text-base text-slate-200">{value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#07111f] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            Education
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Education
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              { school: "Jaycees Boarding Secondary School", level: "Grades 9 & 10", field: "Optional Mathematics", years: "2021–2023" },
              { school: "Tilottama Secondary School", level: "Grades 11 & 12", field: "Science (Biology + Mathematics)", years: "2023–2025" },
            ].map((item) => (
              <div key={item.school} className="rounded-2xl border border-white/10 bg-[#0c1a2d] p-7">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">{item.years}</p>
                <h3 className="mt-4 text-xl font-semibold text-slate-100">{item.school}</h3>
                <p className="mt-3 text-slate-300">{item.level}</p>
                <p className="mt-1 text-slate-500">{item.field}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#07111f] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            Organizations
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Organizations I have worked with
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {organizations.map((organization) => (
              <div key={organization.id} className="flex min-h-32 items-center gap-4 rounded-2xl border border-white/10 bg-[#0c1a2d] px-6 py-5 transition hover:border-cyan-400/30">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-400/5">
                  {organization.logoId ? (
                    <Image src={`/media/organization/${organization.id}?v=${organization.logoId}`} alt={organization.name} width={56} height={56} unoptimized className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className="text-sm font-semibold text-cyan-300">{organization.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <p className="text-sm font-medium leading-6 text-slate-200">{organization.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
