// Shared layout pieces for admin pages: top navigation, page headings,
// status messages, record lists and the "not found" panel.

import Link from "next/link";
import { SignOutButton } from "../sign-out-button";
import { DeleteButton } from "./delete-button";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Publications", href: "/admin/publications" },
  { label: "Research", href: "/admin/research" },
  { label: "Experiences", href: "/admin/experiences" },
  { label: "Achievements", href: "/admin/achievements" },
  { label: "Site & pages", href: "/admin/site" },
  { label: "CV", href: "/admin/cv" },
  { label: "Photo", href: "/admin/photo" },
];

export function AdminNav() {
  return (
    <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition hover:text-white"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/"
          target="_blank"
          className="text-cyan-300 transition hover:text-cyan-200"
        >
          View site ↗
        </Link>
      </nav>
      <SignOutButton />
    </div>
  );
}

export function AdminHeader({
  eyebrow = "Admin",
  title,
  text,
  backHref,
  backLabel,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <>
      {backHref && (
        <Link
          href={backHref}
          className="text-sm text-cyan-300 transition hover:text-cyan-200"
        >
          ← {backLabel}
        </Link>
      )}
      <p
        className={`${backHref ? "mt-10" : ""} text-sm uppercase tracking-[0.3em] text-cyan-300`}
      >
        {eyebrow}
      </p>
      <h1 className="mt-6 text-4xl font-semibold md:text-5xl">{title}</h1>
      {text && <p className="mt-4 text-slate-400">{text}</p>}
    </>
  );
}

export function SavedNotice({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <p
      role="status"
      className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm text-cyan-200"
    >
      {text}
    </p>
  );
}

export function Badge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent";
}) {
  return (
    <span
      className={
        tone === "accent"
          ? "rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-300"
          : "rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400"
      }
    >
      {children}
    </span>
  );
}

export function PublishedBadge({
  published,
  hiddenLabel = "Hidden",
}: {
  published: boolean;
  hiddenLabel?: string;
}) {
  return published ? (
    <Badge tone="accent">Published</Badge>
  ) : (
    <Badge>{hiddenLabel}</Badge>
  );
}

export type ListRow = {
  id: string;
  eyebrow?: string;
  title: string;
  badges: React.ReactNode;
  editHref: string;
};

export function RecordList({
  rows,
  error,
  errorText,
  emptyText,
  deleteAction,
}: {
  rows: ListRow[];
  error: boolean;
  errorText: string;
  emptyText: string;
  deleteAction?: (id: string) => Promise<void>;
}) {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-[#0c1a2d]">
      {error ? (
        <p role="alert" className="p-8 text-red-300">
          {errorText}
        </p>
      ) : rows.length === 0 ? (
        <p className="p-8 text-slate-400">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-4 p-6 md:px-8"
            >
              <div className="min-w-0">
                {row.eyebrow && (
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                    {row.eyebrow}
                  </p>
                )}
                <h2 className="mt-2 text-xl font-semibold">{row.title}</h2>
                <div className="mt-3 flex flex-wrap gap-2">{row.badges}</div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={row.editHref}
                  className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  Edit
                </Link>
                {deleteAction && <DeleteButton action={() => deleteAction(row.id)} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NotFoundPanel({
  eyebrow,
  title,
  text,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  text: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <>
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
        {eyebrow}
      </p>
      <h1 className="mt-6 text-5xl font-semibold">{title}</h1>

      <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
        <p className="text-slate-400">{text}</p>
        <Link
          href={backHref}
          className="mt-6 inline-block text-sm text-cyan-300 transition hover:text-cyan-200"
        >
          ← {backLabel}
        </Link>
      </div>
    </>
  );
}

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
      {children}
    </div>
  );
}
