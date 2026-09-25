import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { AdminNav } from "../../_components/admin-ui";
import { ProjectCreateForm } from "./project-create-form";

export default async function NewProject() {
  await requireAdmin();

  return (
    <>
      <AdminNav />

      <Link
        href="/admin/projects"
        className="text-sm text-cyan-300 transition hover:text-cyan-200"
      >
        ← Back to projects
      </Link>

      <p className="mt-10 text-sm uppercase tracking-[0.3em] text-cyan-300">
        Admin
      </p>

      <h1 className="mt-6 text-4xl font-semibold md:text-5xl">
        New project
      </h1>

      <p className="mt-4 text-slate-400">
        Add a project to your public projects page.
      </p>

      <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
        <ProjectCreateForm />
      </div>
    </>
  );
}