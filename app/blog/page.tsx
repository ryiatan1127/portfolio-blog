import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { T } from "@/components/T";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "博客",
  description: "我写的东西：技术、独立开发与生活随笔。",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow={<T k="pages.blog.eyebrow" />} title={<T k="pages.blog.title" />} />
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {tags.map(({ tag, count }) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full border border-border px-3 py-1 text-sm text-text-muted transition-colors hover:border-accent hover:text-text">
            {tag} · {count}
          </Link>
        ))}
        <Link href="/search" className="ml-auto text-sm text-accent hover:underline"><T k="search.link" /></Link>
      </div>
      <div className="mt-8 space-y-4">
        {posts.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>
        ))}
      </div>
    </section>
  );
}
