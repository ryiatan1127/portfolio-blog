export function Wing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 3c3.5 2 5.5 5.2 5.5 9a5.5 5.5 0 0 1-11 0c0-3.8 2-7 5.5-9Z" />
      <path d="M6.5 13.5 3 16m3-2.5 2 4m8.5-4.5L21 16m-3-2.5-2 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
