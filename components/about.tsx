"use client";

import { motion } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";
import { useT, useTimeline } from "./LanguageProvider";

export function About() {
  const t = useT();
  const timeline = useTimeline();

  return (
    <section className="py-24">
      <SectionHeading eyebrow={t.about.eyebrow} title={t.about.title} />
      <div className="mt-10 space-y-6">
        {timeline.map((item, i) => (
          <ScrollReveal key={item.year} delay={i * 0.1}>
            {/* 时间线条目：悬停右移 + 背景泛光 + 左侧轴线变亮 + 年份文字发光 */}
            <motion.div
              whileHover={{ x: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group flex gap-6 rounded-lg border-l border-border bg-transparent py-2 pl-6 pr-4 transition-all duration-300 hover:border-l-accent/60 hover:bg-bg-elevated hover:shadow-glow hover:backdrop-blur"
            >
              <span className="font-mono text-accent transition-shadow duration-300 group-hover:[text-shadow:0_0_12px_rgba(217,165,199,0.8)]">
                {item.year}
              </span>
              <p className="text-text-muted transition-colors duration-300 group-hover:text-text">{item.text}</p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
