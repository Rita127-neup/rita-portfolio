import Link from "next/link";
import { notFound } from "next/navigation";
import { InnerShell } from "@/app/_components/inner-shell";
import { PostBody } from "@/app/_components/post-body";
import { getAboutExtras, getBlogPost } from "@/lib/content";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { blogEnabled } = await getAboutExtras();
  if (!blogEnabled) notFound();
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <InnerShell>
      <Link href="/blog" className="text-sm text-[#96506f] underline underline-offset-4">← All posts</Link>
      <h1 className="editorial-title mt-5">{post.title}</h1>
      {post.publishedAt && (
        <p className="mt-3 text-xs uppercase tracking-[0.08em] text-[#7b6670]">
          {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}
      <div className="mt-8">
        <PostBody text={post.body} />
      </div>
    </InnerShell>
  );
}
