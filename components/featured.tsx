"use client";

import Link from "next/link";
import { BlogCard } from "./BlogCard";
import { ProjectCard } from "./ProjectCard";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";
import { useT, useProjects } from "./LanguageProvider";
import type { PostMeta } from "@/lib/posts";

// posts 由服务端页面预取后传入（getAllPosts 依赖 fs，不能进客户端）
export function Featured({ posts }: { posts: PostMeta[] }) {
  const t = useT();
  const projects = useProjects().filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <section className="py-24">
        {/* 首页唯一 h1 在 Hero，区块标题保持 h2 */}
        <SectionHeading eyebrow={t.featured.eyebrow} title={t.featured.title} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (<ScrollReveal key={p.slug} delay={i * 0.05}><ProjectCard project={p} /></ScrollReveal>))}
        </div>
        <ScrollReveal className="mt-8"><Link href="/projects" className="text-accent hover:underline">{t.featured.viewAll}</Link></ScrollReveal>
      </section>
      <section className="py-24">
        <SectionHeading eyebrow={t.featured.writingEyebrow} title={t.featured.writingTitle} />
        <div className="mt-10 space-y-4">
          {posts.map((p, i) => (<ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>))}
        </div>
        <ScrollReveal className="mt-8"><Link href="/blog" className="text-accent hover:underline">{t.featured.viewAllPosts}</Link></ScrollReveal>
      </section>
    </>
  );
}
