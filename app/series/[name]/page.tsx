import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { T } from "@/components/T";
import { getAllSeries, getPostsBySeries } from "@/lib/posts";

export function generateStaticParams() {
  return getAllSeries().map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  return { title: `系列：${name}`, description: `「${name}」系列的全部文章。` };
}

export default async function SeriesPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  // ⚠️ Next 传入的 params 已解码，不要再 decodeURIComponent
  const posts = getPostsBySeries(name);

  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow={<T k="pages.series.eyebrow" />} title={name} />
      <div className="mt-8 space-y-4">
        {posts.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>
        ))}
      </div>
    </section>
  );
}
