import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { T } from "@/components/T";

export default function NotFound() {
  return (
    <section className="py-32 text-center">
      <SectionHeading as="h1" eyebrow="404" title={<T k="pages.notFound.title" />} />
      <p className="mt-6 text-text-muted"><T k="pages.notFound.body" /></p>
      <Link href="/" className="mt-8 inline-block text-accent hover:underline"><T k="pages.notFound.back" /></Link>
    </section>
  );
}
