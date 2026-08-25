import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold">相关文章</h2>
      <div className="mt-4 space-y-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block rounded-lg border border-border bg-bg-elevated p-4 backdrop-blur transition-colors hover:border-accent">
            <span className="font-semibold">{p.title}</span>
            <span className="ml-3 text-sm text-text-muted">{p.date}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
