"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "./LanguageProvider";

type Doc = { slug: string; title: string; description: string; tags: string[]; content: string };

export function SearchBox() {
  const t = useT();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    fetch("/search-index.json").then((r) => r.json()).then(setDocs).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 150);
    return () => clearTimeout(t);
  }, [q]);

  const results = debounced
    ? docs.filter((d) => `${d.title} ${d.description} ${d.tags.join(" ")} ${d.content}`.toLowerCase().includes(debounced.toLowerCase())).slice(0, 20)
    : [];

  return (
    <form role="search" className="w-full">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label={t.search.label}
        placeholder={t.search.placeholder}
        className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-text outline-none backdrop-blur placeholder:text-text-muted focus:border-accent"
      />
      <ul className="mt-6 space-y-3">
        {debounced && results.map((r) => (
          <li key={r.slug}>
            <Link href={`/blog/${r.slug}`} className="block rounded-lg border border-border bg-bg-elevated p-4 backdrop-blur transition-colors hover:border-accent">
              <span className="font-semibold">{r.title}</span>
              <span className="ml-3 text-sm text-text-muted">{r.description}</span>
            </Link>
          </li>
        ))}
        {debounced && results.length === 0 && <li className="text-text-muted">{t.search.empty}</li>}
      </ul>
    </form>
  );
}
