"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => Boolean(e));
    const observer = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id); },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;
  return (
    <nav className="rounded-lg border border-border bg-bg-elevated p-4 text-sm backdrop-blur">
      <p className="mb-2 font-semibold text-text">目录</p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? 16 : 0 }}>
            <a href={`#${h.id}`} className={active === h.id ? "text-accent" : "text-text-muted hover:text-accent"}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
