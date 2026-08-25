import { notFound } from "next/navigation";
import { MdxContent } from "@/lib/mdx";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAllPosts, getPostBySlug, readingTime, wordCount } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();   // getPostBySlug 对不存在/草稿返回 undefined，此处兜底生效

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-2xl py-32">
        <ScrollReveal>
          <p className="font-mono text-sm text-text-muted">{post.date} · 约 {readingTime(post.content)} 分钟 · {wordCount(post.content)} 字</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight">{post.title}</h1>
          <p className="mt-4 text-text-muted">{post.description}</p>
        </ScrollReveal>
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.title} className="mt-8 h-64 w-full rounded-lg object-cover" />
        )}
        <div className="mt-10"><MdxContent source={post.content} /></div>
      </article>
    </>
  );
}
