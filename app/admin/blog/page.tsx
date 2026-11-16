import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Badge, Panel } from "../_components/admin-ui";
import { createPost, deletePost, setBlogEnabled } from "./actions";
import { PostForm } from "./post-form";

export const dynamic = "force-dynamic";

const input = "mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white";

export default async function AdminBlog({ searchParams }: { searchParams: Promise<{ problem?: string }> }) {
  await requireAdmin();
  const { problem } = await searchParams;
  const supabase = await createClient();
  const [{ data: settings }, { data: posts, error }] = await Promise.all([
    supabase.from("site_settings").select("blog_enabled").eq("id", 1).single(),
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, body, is_published, published_at")
      .order("created_at", { ascending: false }),
  ]);
  const enabled = Boolean(settings?.blog_enabled);

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Blog"
        text="Write posts here whenever you like. Nothing is visible to visitors until you switch the blog on below."
        backHref="/admin"
        backLabel="Back to dashboard"
      />

      {problem && (
        <p role="alert" className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200">
          {problem === "address"
            ? "Another post already uses that web address. Change the title a little and try again."
            : "That did not save. Please try again."}
        </p>
      )}

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Blog on the website</h2>
            <p className="mt-2 text-slate-400">
              {enabled
                ? "The blog is ON. Published posts are public and a Blog link shows in the menu."
                : "The blog is OFF. No page, no menu link; only you can see posts here."}
            </p>
          </div>
          <Badge tone={enabled ? "accent" : "muted"}>{enabled ? "On" : "Off"}</Badge>
        </div>
        <form action={setBlogEnabled} className="mt-5 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-3 text-slate-300">
            <input type="checkbox" name="enabled" defaultChecked={enabled} className="h-5 w-5 accent-cyan-400" />
            Show the blog on my website
          </label>
          <button type="submit" className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300">
            Apply
          </button>
        </form>
      </Panel>

      <Panel>
        <h2 className="text-lg font-semibold">New post</h2>
        <form action={createPost} className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="new-title" className="text-sm text-slate-300">Title</label>
            <input id="new-title" name="title" required maxLength={200} className={input} />
          </div>
          <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f]">
            Create draft
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-500">It starts as a draft. Open it below to write and publish.</p>
      </Panel>

      <div className="mt-8 space-y-5">
        {error ? (
          <Panel><p className="text-red-300">Could not load posts: {error.message}</p></Panel>
        ) : (posts ?? []).length === 0 ? (
          <p className="text-slate-500">No posts yet.</p>
        ) : (
          (posts ?? []).map((post) => (
            <details key={post.id} className="rounded-3xl border border-white/10 bg-[#0c1a2d] p-6">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
                <span className="text-lg font-semibold">{post.title}</span>
                <Badge tone={post.is_published ? "accent" : "muted"}>{post.is_published ? "Published" : "Draft"}</Badge>
              </summary>
              <div className="mt-6">
                <PostForm post={post} />
                <form action={deletePost} className="mt-4">
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300">
                    Delete post
                  </button>
                </form>
              </div>
            </details>
          ))
        )}
      </div>
    </>
  );
}
