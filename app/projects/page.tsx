import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "作品集",
  description: "我做过的东西：项目展示与源码链接。",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  return (
    <section className="py-32">
      <SectionHeading as="h1" eyebrow="作品集" title="我做过的东西" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ScrollReveal key={p.slug} delay={i * 0.05}><ProjectCard project={p} /></ScrollReveal>
        ))}
      </div>
    </section>
  );
}
