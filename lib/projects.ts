import { projects, type Project } from "@/content/projects";

export function getAllProjects(): Project[] { return projects; }
export function getFeaturedProjects(): Project[] { return projects.filter((p) => p.featured); }
