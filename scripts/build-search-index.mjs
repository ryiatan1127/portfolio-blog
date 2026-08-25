import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 剥离 Markdown 语法，正文只留纯文本：搜索更准、JSON 更小
// ⚠️ 与 lib/plaintext.ts 的 toPlainText 逻辑保持同步（本脚本为 .mjs，Node 20 无法直接 import TS；升级 Node ≥ 22.18 后可改为单点复用）
function toPlainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")          // 代码块
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")     // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")   // 链接保留文字
    .replace(/[#>*`~\-_|]/g, " ")              // markdown 符号
    .replace(/\s+/g, " ")
    .trim();
}

const dir = path.join(process.cwd(), "content", "posts");
const outDir = path.join(process.cwd(), "public");

// 与 lib/site.ts 保持同步：解析其中的 SITE_URL 常量（app/sitemap.ts / app/robots.ts 在
// `output: "export"` 下不生成产物，改由本脚本输出静态文件 —— 见 implementation-plan Task 22 回退方案）
function readSiteUrl() {
  const src = fs.readFileSync(path.join(process.cwd(), "lib", "site.ts"), "utf8");
  const m = src.match(/SITE_URL\s*=\s*"([^"]+)"/);
  return m ? m[1] : "https://YOUR-DOMAIN.com";
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
const posts = files
  .map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { data, content } = matter(raw);
    return {
      slug: f.replace(/\.mdx$/, ""),
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
      tags: Array.isArray(data.tags) ? data.tags : [],
      series: typeof data.series === "string" ? data.series : undefined,
      content: toPlainText(content),
      draft: data.draft ?? false,
    };
  })
  .filter((p) => !p.draft);

// --- search-index.json ---
const index = posts.map(({ slug, title, description, tags, content }) => ({ slug, title, description, tags, content }));
fs.writeFileSync(path.join(outDir, "search-index.json"), JSON.stringify(index));

// --- sitemap.xml（回退产物：app/sitemap.ts 在 output:export 下不生成）---
const base = readSiteUrl();
const tagSet = [...new Set(posts.flatMap((p) => p.tags))];
const seriesSet = [...new Set(posts.map((p) => p.series).filter(Boolean))];
const url = (loc, lastmod) => `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
const today = new Date().toISOString().slice(0, 10);
const urls = [
  url(`${base}/`, today),
  url(`${base}/projects`, today),
  url(`${base}/blog`, today),
  url(`${base}/archive`, today),
  url(`${base}/search`, today),
  ...posts.map((p) => url(`${base}/blog/${p.slug}`, p.date)),
  ...tagSet.map((t) => url(`${base}/tags/${encodeURIComponent(t)}`)),
  ...seriesSet.map((s) => url(`${base}/series/${encodeURIComponent(s)}`)),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);

// --- robots.txt（回退产物：app/robots.ts 在 output:export 下不生成）---
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`;
fs.writeFileSync(path.join(outDir, "robots.txt"), robots);
