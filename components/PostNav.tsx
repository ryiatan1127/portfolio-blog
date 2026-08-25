import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostNav({ newer, older }: { newer?: PostMeta; older?: PostMeta }) {
  return (
    <nav className="mt-12 flex justify-between gap-4 border-t border-border pt-6 text-sm">
      {newer ? <Link href={`/blog/${newer.slug}`} className="text-text-muted hover:text-accent">← {newer.title}</Link> : <span />}
      {older ? <Link href={`/blog/${older.slug}`} className="text-right text-text-muted hover:text-accent">{older.title} →</Link> : <span />}
    </nav>
  );
}
