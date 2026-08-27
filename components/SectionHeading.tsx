"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "./ScrollReveal";

type Props = { eyebrow: ReactNode; title: ReactNode; as?: "h1" | "h2" };

export function SectionHeading({ eyebrow, title, as = "h2" }: Props) {
  const Tag = as;
  return (
    <ScrollReveal>
      <p className="text-sm font-medium tracking-widest text-accent">{eyebrow}</p>
      <Tag className="font-display mt-2 text-3xl font-semibold tracking-tight">{title}</Tag>
    </ScrollReveal>
  );
}
