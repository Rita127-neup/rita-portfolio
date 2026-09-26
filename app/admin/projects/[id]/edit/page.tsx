import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "../../../_components/admin-ui";
import { ProjectImageUpload } from "./project-image-upload";
import { isProjectId } from "../../validation";
import {
  ProjectEditForm,
  type EditableProject,
} from "./project-edit-form";

export default async function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  if (!isProjectId(id)) notFound();

  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, title, category, description, status, tags, link_url, image_id, sort_order, is_published",
    )
    .eq("id", id)
    .maybeSingle<EditableProject>();

  if (error) throw new Error("Could not load project.");
  if (!project) notFound();

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
        Edit project
      </p>

      <h1 className="mt-6 text-4xl font-semibold md:text-5xl">
        {project.title}
      </h1>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
          <ProjectEditForm project={project} />
        </div>
        <ProjectImageUpload projectId={project.id} imageId={project.image_id} />
      </div>
    </>
  );
}