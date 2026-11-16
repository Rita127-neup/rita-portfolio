"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/admin/form";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

type Fields = { title: string; slug: string; excerpt: string; body: string };

function readFields(formData: FormData): Fields | null {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").replace(/\r\n/g, "\n").trim();
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n").trim();
  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  if (!title || title.length > 200 || excerpt.length > 500 || body.length > 60000 || !slug) return null;
  return { title, slug, excerpt, body };
}

function refresh() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/blog");
}

/** The master switch. While it is off the database returns no posts to visitors. */
export async function setBlogEnabled(formData: FormData): Promise<void> {
  await requireAdmin();
  const enabled = formData.get("enabled") === "on";
  const supabase = await createClient();
  // updated_at is filled in by the database itself; the admin role may not write it.
  const { data, error } = await supabase.from("site_settings").update({ blog_enabled: enabled }).eq("id", 1).select("id");
  if (error || data?.length !== 1) redirect("/admin/blog?problem=1");
  refresh();
}

export async function createPost(formData: FormData): Promise<void> {
  await requireAdmin();
  const fields = readFields(formData);
  if (!fields) redirect("/admin/blog?problem=1");
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").insert({ ...fields, is_published: false });
  if (error) redirect(`/admin/blog?problem=${error.code === "23505" ? "address" : "1"}`);
  refresh();
}

export async function updatePost(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const fields = readFields(formData);
  if (!isUuid(id) || !fields) return { error: "Check the title, address and length of each box, then try again." };
  const publish = formData.get("is_published") === "on";

  const supabase = await createClient();
  const { data: existing } = await supabase.from("blog_posts").select("is_published, published_at").eq("id", id).single();
  if (!existing) return { error: "Post not found." };

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...fields,
      is_published: publish,
      published_at: publish ? (existing.published_at ?? new Date().toISOString()) : existing.published_at,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) {
    return { error: error.code === "23505" ? "Another post already uses that web address." : "The post could not be saved." };
  }
  refresh();
  return {};
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isUuid(id)) return;
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) redirect("/admin/blog?problem=1");
  refresh();
}
