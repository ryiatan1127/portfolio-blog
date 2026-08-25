import Link from "next/link";
import { BlogCard } from "./BlogCard";
import { ProjectCard } from "./ProjectCard";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";
import { getAllPosts } from "@/lib/posts";
import { getFeaturedProjects } from "@/lib/projects";

export function Featured() {
  const projects = getFeaturedProjects().slice(0, 3);
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <section className="py-24">
        {/* 首页唯一 h1 在 Hero，区块标题保持 h2 */}
        <SectionHeading eyebrow="精选" title="代表作品" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (<ScrollReveal key={p.slug} delay={i * 0.05}><ProjectCard project={p} /></ScrollReveal>))}
        </div>
        <ScrollReveal className="mt-8"><Link href="/projects" className="text-accent hover:underline">查看全部作品 →</Link></ScrollReveal>
      </section>
      <section className="py-24">
        <SectionHeading eyebrow="写作" title="最新文章" />
        <div className="mt-10 space-y-4">
          {posts.map((p, i) => (<ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>))}
        </div>
        <ScrollReveal className="mt-8"><Link href="/blog" className="text-accent hover:underline">查看全部文章 →</Link></ScrollReveal>
      </section>
    </>
  );
}
