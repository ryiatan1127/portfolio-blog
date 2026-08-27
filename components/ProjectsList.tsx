"use client";

import { ProjectCard } from "./ProjectCard";
import { ScrollReveal } from "./ScrollReveal";
import { useProjects } from "./LanguageProvider";

/** 项目列表：按当前语言渲染中文/英文项目数据 */
export function ProjectsList() {
  const projects = useProjects();
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      {projects.map((p, i) => (
        <ScrollReveal key={p.slug} delay={i * 0.05}><ProjectCard project={p} /></ScrollReveal>
      ))}
    </div>
  );
}
