import type { Metadata } from "next";
import { SearchBox } from "@/components/SearchBox";
import { SectionHeading } from "@/components/SectionHeading";
import { T } from "@/components/T";

export const metadata: Metadata = {
  title: "搜索",
  description: "站内搜索文章标题、标签与正文。",
};

export default function SearchPage() {
  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow={<T k="pages.search.eyebrow" />} title={<T k="pages.search.title" />} />
      <div className="mt-8"><SearchBox /></div>
    </section>
  );
}
