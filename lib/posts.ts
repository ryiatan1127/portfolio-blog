import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { toPlainText } from "./plaintext";

const postsDir = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  series?: string;
  cover?: string;
  draft?: boolean;
};

export type Post = PostMeta & { content: string };

function readPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((f) => {
    const raw = fs.readFileSync(path.join(postsDir, f), "utf8");
    const { data } = matter(raw);
    return { slug: f.replace(/\.mdx$/, ""), ...(data as Omit<PostMeta, "slug">) };
  });
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

let cache: PostMeta[] | null = null;

export function getAllPosts(): PostMeta[] {
  // 构建期缓存，避免多页面重复读盘；dev 下实时读盘，新增文章无需重启
  if (process.env.NODE_ENV !== "production") return readPosts();
  if (!cache) cache = readPosts();
  return cache;
}

export function getPostBySlug(slug: string): Post | undefined {
  if (!/^[a-z0-9-]+$/i.test(slug)) return undefined; // slug 白名单：防路径穿越（NFR-7）
  const file = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const meta = { slug, ...(data as Omit<PostMeta, "slug">) };
  if (meta.draft) return undefined; // 草稿不发布，也不可直链访问
  return { ...meta, content };
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts()) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAllSeries(): string[] {
  return [...new Set(getAllPosts().map((p) => p.series).filter((s): s is string => Boolean(s)))];
}

export function getPostsBySeries(name: string): PostMeta[] {
  return getAllPosts().filter((p) => p.series === name);
}

export function getRelatedPosts(slug: string, n = 3): PostMeta[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      // 共享标签数加权 + 同系列优先（P2 优化）
      const score = (p: PostMeta) =>
        p.tags.filter((t) => current.tags.includes(t)).length * 2 +
        (p.series && p.series === current.series ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, n);
}

export function getPrevNextPost(slug: string): { newer?: PostMeta; older?: PostMeta } {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return { newer: posts[idx - 1], older: posts[idx + 1] };
}

export function wordCount(content: string): number {
  return toPlainText(content).replace(/\s+/g, "").length; // 与搜索索引（Task 19）共用纯文本逻辑
}

export function readingTime(content: string): number {
  const chinese = (content.match(/[一-龥]/g) || []).length;
  const others = content.replace(/[一-龥]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(chinese / 300 + others / 200));
}
