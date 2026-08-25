import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/lib/mdx";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TableOfContents } from "@/components/TableOfContents";
import { PostNav } from "@/components/PostNav";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ShareButtons } from "@/components/ShareButtons";
import { getAllPosts, getPostBySlug, getRelatedPosts, getPrevNextPost, readingTime, wordCount } from "@/lib/posts";
import { extractHeadings } from "@/lib/headings";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();   // getPostBySlug 对不存在/草稿返回 undefined，此处兜底生效

  const headings = extractHeadings(post.content);
  const related = getRelatedPosts(slug);
  const { newer, older } = getPrevNextPost(slug);

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-4xl py-32">
        <ScrollReveal>
          <p className="font-mono text-sm text-text-muted">{post.date} · 约 {readingTime(post.content)} 分钟 · {wordCount(post.content)} 字</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight">{post.title}</h1>
          <p className="mt-4 text-text-muted">{post.description}</p>
        </ScrollReveal>
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.title} className="mt-8 h-64 w-full rounded-lg object-cover" />
        )}
        <div className="mt-10 flex gap-8">
          <div className="min-w-0 max-w-prose flex-1"><MdxContent source={post.content} /></div>
          <aside className="hidden w-56 shrink-0 lg:block"><div className="sticky top-24"><TableOfContents headings={headings} /></div></aside>
        </div>
        <ShareButtons title={post.title} slug={slug} />
        <RelatedPosts posts={related} />
        <PostNav newer={newer} older={older} />
      </article>
    </>
  );
}
