"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { PostMeta } from "@/lib/posts";

export function BlogCard({ post }: { post: PostMeta }) {
  return (
    <motion.article whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Link href={`/blog/${post.slug}`} className="block rounded-lg border border-border bg-bg-elevated p-6 backdrop-blur transition-colors hover:border-accent">
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.title} className="mb-4 h-40 w-full rounded-md object-cover" />
        )}
        <p className="font-mono text-xs text-text-muted">{post.date}</p>
        <h3 className="font-display mt-2 text-lg font-semibold transition-colors hover:text-accent">{post.title}</h3>
        <p className="mt-2 text-sm text-text-muted">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link key={t} href={`/tags/${encodeURIComponent(t)}`} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-muted hover:border-accent">#{t}</Link>
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
