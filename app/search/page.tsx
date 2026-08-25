import type { Metadata } from "next";
import { SearchBox } from "@/components/SearchBox";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "搜索",
  description: "站内搜索文章标题、标签与正文。",
};

export default function SearchPage() {
  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow="搜索" title="找文章" />
      <div className="mt-8"><SearchBox /></div>
    </section>
  );
}
