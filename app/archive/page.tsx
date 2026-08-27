import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { T } from "@/components/T";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "归档",
  description: "全部文章按年份归档。",
};

export default function ArchivePage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const byYear = new Map<string, typeof posts>();
  for (const p of posts) {
    const year = p.date.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), p]);
  }

  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow={<T k="pages.archive.eyebrow" />} title={<T k="pages.archive.title" />} />
      <div className="mt-10 space-y-10">
        {/* 标签云：标签聚合（PRD FR-3.9），筛选见标签页 */}
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full border border-border px-3 py-1 text-sm text-text-muted transition-colors hover:border-accent hover:text-text">
              {tag} · {count}
            </Link>
          ))}
        </div>
        {[...byYear.entries()].map(([year, list]) => (
          <div key={year}>
            <h2 className="font-display text-2xl font-semibold text-accent">{year}</h2>
            <ul className="mt-4 space-y-3">
              {list.map((p) => (
                <li key={p.slug} className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-text-muted">{p.date}</span>
                  <Link href={`/blog/${p.slug}`} className="hover:text-accent">{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
