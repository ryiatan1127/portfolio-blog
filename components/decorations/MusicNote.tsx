export function MusicNote({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M9 18.5A3.5 3.5 0 1 1 5.5 15 3.5 3.5 0 0 1 9 18.5Zm10-8A3.5 3.5 0 1 1 15.5 7 3.5 3.5 0 0 1 19 10.5Z" />
      <path d="M9 18.5V5l10-2v7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
