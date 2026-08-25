import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export default function NotFound() {
  return (
    <section className="py-32 text-center">
      <SectionHeading as="h1" eyebrow="404" title="页面走丢了" />
      <p className="mt-6 text-text-muted">你访问的页面不存在，回首页看看吧。</p>
      <Link href="/" className="mt-8 inline-block text-accent hover:underline">回到首页 →</Link>
    </section>
  );
}
