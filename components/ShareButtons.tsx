"use client";

import { useState } from "react";
import { useT } from "./LanguageProvider";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  const share = async () => {
    const data = { title, url };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else copy();
  };

  return (
    <div className="mt-8 flex gap-3 text-sm">
      <button onClick={copy} className="rounded-lg border border-border px-3 py-1.5 text-text-muted hover:border-accent">{copied ? t.share.copied : t.share.copy}</button>
      <button onClick={share} className="rounded-lg border border-border px-3 py-1.5 text-text-muted hover:border-accent">{t.share.share}</button>
    </div>
  );
}
