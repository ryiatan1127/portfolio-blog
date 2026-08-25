import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "./SectionHeading";
import { timeline } from "@/content/timeline";

export function About() {
  return (
    <section className="py-24">
      <SectionHeading eyebrow="关于我" title="我的经历" />
      <div className="mt-10 space-y-6">
        {timeline.map((item, i) => (
          <ScrollReveal key={item.year} delay={i * 0.1}>
            <div className="flex gap-6 border-l border-border pl-6">
              <span className="font-mono text-accent">{item.year}</span>
              <p className="text-text-muted">{item.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
