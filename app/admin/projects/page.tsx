import Link from "next/link";
import { DeleteButton } from "../_components/delete-button";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminNav, Badge } from "../_components/admin-ui";
import { deleteProject } from "./actions";

type ProjectRow = {
  id: string;
  title: string;
  category: string;
  status: string;
  is_published: boolean;
  sort_order: number;
};

export default async function AdminProjects({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  // Authorize before touching any project data.
  await requireAdmin();

  const { saved } = await searchParams;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, category, status, is_published, sort_order")
    .order("sort_order", { ascending: true });

  const projects = (data ?? []) as ProjectRow[];

  return (
    <>
      <AdminNav />
      <Link
        href="/admin"
        className="text-sm text-cyan-300 transition hover:text-cyan-200"
      >
        ← Back to dashboard
      </Link>

      <p className="mt-10 text-sm uppercase tracking-[0.3em] text-cyan-300">
        Admin
      </p>
      <h1 className="mt-6 text-5xl font-semibold">Projects</h1>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">\n        <p className="text-slate-400">
        Projects shown on the public projects page, in display order.
      </p>

      {saved === "1" && (
        <p
          role="status"
          className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm text-cyan-200"
        >
          Project saved.
        </p>
      )}

      <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-[#0c1a2d]">
        {error ? (
          <p role="alert" className="p-8 text-red-300">
            Could not load projects. Please try again.
          </p>
        ) : projects.length === 0 ? (
          <p className="p-8 text-slate-400">No projects found.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-4 p-6 md:px-8"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                    {project.category}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    {project.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>Order {project.sort_order}</Badge>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      {project.status}
                    </span>
                    {project.is_published ? (
                      <span className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-300">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
