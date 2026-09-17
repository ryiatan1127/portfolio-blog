import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MdxContent } from "@/lib/mdx";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ArticleLocalized } from "@/components/ArticleLocalized";
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
  const zh = getPostBySlug(slug);
  if (!zh) notFound();   // getPostBySlug 对不存在/草稿返回 undefined，此处兜底生效
  const en = getPostBySlug(slug, "en"); // 无英文版时为 undefined，客户端回退中文

  const related = getRelatedPosts(slug);
  const { newer, older } = getPrevNextPost(slug);

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-4xl py-32">
        <ArticleLocalized
          cover={zh.cover}
          zh={{
            title: zh.title,
            description: zh.description,
            date: zh.date,
            readingTime: readingTime(zh.content),
            wordCount: wordCount(zh.content),
            headings: extractHeadings(zh.content),
            body: <MdxContent source={zh.content} />,
          }}
          en={
            en
              ? {
                  title: en.title,
                  description: en.description,
                  date: en.date,
                  readingTime: readingTime(en.content),
                  wordCount: wordCount(en.content),
                  headings: extractHeadings(en.content),
                  body: <MdxContent source={en.content} />,
                }
              : undefined
          }
        />
        <ShareButtons title={zh.title} slug={slug} />
        <RelatedPosts posts={related} />
        <PostNav newer={newer} older={older} />
      </article>
    </>
  );
}
