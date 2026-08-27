"use client";

import { useRef, useState } from "react";
import { useT } from "./LanguageProvider";

type PreProps = React.HTMLAttributes<HTMLPreElement> & { "data-language"?: string };

export function Pre(props: PreProps) {
  const t = useT();
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const lang = props["data-language"];

  const onCopy = async () => {
    const code = ref.current?.querySelector("code")?.textContent ?? "";
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="group relative my-4">
      {lang && <span className="absolute left-3 top-2 text-xs uppercase text-text-muted">{lang}</span>}
      <pre ref={ref} {...props} className="overflow-x-auto rounded-lg border border-border bg-bg-elevated p-4 pt-8 text-sm" />
      <button onClick={onCopy} className="absolute right-2 top-2 rounded border border-border bg-bg px-2 py-0.5 text-xs text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
        {copied ? t.codeBlock.copied : t.codeBlock.copy}
      </button>
    </div>
  );
}
