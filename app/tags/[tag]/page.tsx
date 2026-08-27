import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeading } from "@/components/SectionHeading";
import { T } from "@/components/T";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}`, description: `标签「${tag}」下的全部文章。` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  // ⚠️ Next 传入的 params 已解码，不要再 decodeURIComponent（含 % 的标签会二次解码抛 URIError）
  const posts = getPostsByTag(tag);

  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow={<T k="pages.tags.eyebrow" />} title={`#${tag}`} />
      <div className="mt-8 space-y-4">
        {posts.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}><BlogCard post={p} /></ScrollReveal>
        ))}
      </div>
    </section>
  );
}
