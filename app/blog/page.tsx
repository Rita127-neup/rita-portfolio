import Link from "next/link";
import { notFound } from "next/navigation";
import { InnerShell } from "@/app/_components/inner-shell";
import { getAboutExtras, getBlogPosts } from "@/lib/content";

export const metadata = { title: "Blog" };

// The blog stays invisible (a plain 404) until it is switched on in the admin.
export default async function Blog() {
  const { blogEnabled } = await getAboutExtras();
  if (!blogEnabled) notFound();
  const posts = await getBlogPosts();

  return (
    <InnerShell>
      <h1 className="editorial-title">Blog</h1>
      {posts.length === 0 ? (
        <p className="mt-6 text-[#7b6670]">The first post is on its way.</p>
      ) : (
        <ol className="mt-8">
          {posts.map((post) => (
            <li key={post.id} className="border-t border-[#ddd5d6] py-6 first:border-t-0 first:pt-2">
              <h2 className="font-display text-[1.25rem] font-medium leading-snug text-[#4a3440]">
                <Link href={`/blog/${post.slug}`} className="transition-opacity hover:opacity-70">{post.title}</Link>
              </h2>
              {post.publishedAt && (
                <p className="mt-1 text-xs uppercase tracking-[0.08em] text-[#7b6670]">
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
              {post.excerpt && <p className="mt-2 max-w-[38rem] leading-7 text-[#55454d]">{post.excerpt}</p>}
            </li>
          ))}
        </ol>
      )}
    </InnerShell>
  );
}
