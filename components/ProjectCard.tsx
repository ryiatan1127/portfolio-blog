"use client";

import { motion } from "motion/react";
import type { Project } from "@/content/projects";
import { useT } from "./LanguageProvider";

export function ProjectCard({ project }: { project: Project }) {
  const t = useT();
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-lg border border-border bg-bg-elevated p-6 backdrop-blur transition-shadow hover:shadow-glow"
    >
      <div className="mb-4 flex h-28 items-center justify-center rounded-md bg-gradient-to-br from-accent/30 to-accent-2/30 text-3xl">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt={project.title} className="h-full w-full rounded-md object-cover" />
        ) : (
          <span className="text-text-muted">{project.title.slice(0, 1)}</span>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm text-text-muted">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-muted">{t}</span>
        ))}
      </div>
      <div className="mt-5 flex gap-4 text-sm">
        {project.links.demo && <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-accent hover:underline">{t.projectCard.demo}</a>}
        {project.links.repo && <a href={project.links.repo} target="_blank" rel="noreferrer" className="text-accent hover:underline">{t.projectCard.source}</a>}
      </div>
    </motion.article>
  );
}
