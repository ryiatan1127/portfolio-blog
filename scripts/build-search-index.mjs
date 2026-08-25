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
const out = path.join(process.cwd(), "public", "search-index.json");

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
const index = files
  .map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { data, content } = matter(raw);
    return {
      slug: f.replace(/\.mdx$/, ""),
      title: data.title ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      content: toPlainText(content),
      draft: data.draft ?? false,
    };
  })
  .filter((p) => !p.draft)
  .map(({ draft, ...rest }) => rest);

fs.writeFileSync(out, JSON.stringify(index));
