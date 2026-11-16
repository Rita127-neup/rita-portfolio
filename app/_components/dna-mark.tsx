/**
 * A small DNA double helix: two sage strands that cross, with rose rungs
 * between them. Used as the site mark in the header and as the favicon.
 */
export function DnaMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" strokeLinecap="round" aria-hidden="true">
      <path d="M21 6c0 14 22 16 22 29S21 50 21 58" stroke="#6f8f78" strokeWidth="4.5" />
      <path d="M43 6c0 14-22 16-22 29S43 50 43 58" stroke="#96506f" strokeWidth="4.5" />
      <path d="M26 15h12M24.5 25h15M24.5 45h15M26 55h12" stroke="#d3a1b8" strokeWidth="3" />
    </svg>
  );
}
