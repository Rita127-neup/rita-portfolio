import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <>
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
        Edit project
      </p>
      <h1 className="mt-6 text-5xl font-semibold">Project not found</h1>

      <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
        <p className="text-slate-400">
          This project does not exist or the link is invalid.
        </p>
        <Link
          href="/admin/projects"
          className="mt-6 inline-block text-sm text-cyan-300 transition hover:text-cyan-200"
        >
          ← Back to projects
        </Link>
      </div>
    </>
  );
}
