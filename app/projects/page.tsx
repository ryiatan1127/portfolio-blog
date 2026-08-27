import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { T } from "@/components/T";
import { ProjectsList } from "@/components/ProjectsList";

export const metadata: Metadata = {
  title: "作品集",
  description: "我做过的东西：项目展示与源码链接。",
};

export default function ProjectsPage() {
  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow={<T k="pages.projects.eyebrow" />} title={<T k="pages.projects.title" />} />
      <ProjectsList />
    </section>
  );
}
