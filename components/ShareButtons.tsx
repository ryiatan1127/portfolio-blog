"use client";

import { useState } from "react";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
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
      <button onClick={copy} className="rounded-lg border border-border px-3 py-1.5 text-text-muted hover:border-accent">{copied ? "已复制链接" : "复制链接"}</button>
      <button onClick={share} className="rounded-lg border border-border px-3 py-1.5 text-text-muted hover:border-accent">分享</button>
    </div>
  );
}
