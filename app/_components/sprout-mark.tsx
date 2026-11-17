/**
 * A tiny sprout with a sleepy smile and pink cheeks. It stands in for the words "Owner login" in
 * the footer, so it stays quiet: thin strokes and the same three colours as the rest of the site.
 */
export function SproutMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* the two leaves and the stem */}
      <path d="M16 12V8.6" stroke="#6f8f78" strokeWidth="1.5" />
      <path d="M16 9.4Q13.4 4.4 8.6 5.2Q9.6 9.8 16 9.4Z" fill="#8fae9a" stroke="#6f8f78" strokeWidth="1" />
      <path d="M16 8.6Q18.6 3 23.6 3.6Q22.6 8.8 16 8.6Z" fill="#6f8f78" stroke="#6f8f78" strokeWidth="1" />
      {/* the round body */}
      <circle cx="16" cy="20.6" r="8.6" fill="#eef4ef" stroke="#6f8f78" strokeWidth="1.4" />
      {/* face */}
      <circle cx="12.9" cy="19.7" r="1.05" fill="#4a3440" stroke="none" />
      <circle cx="19.1" cy="19.7" r="1.05" fill="#4a3440" stroke="none" />
      <path d="M14.6 22.5Q16 23.8 17.4 22.5" stroke="#4a3440" strokeWidth="1.2" />
      <ellipse cx="10.7" cy="22.4" rx="1.6" ry="1.05" fill="#e3b2c6" stroke="none" opacity="0.9" />
      <ellipse cx="21.3" cy="22.4" rx="1.6" ry="1.05" fill="#e3b2c6" stroke="none" opacity="0.9" />
    </svg>
  );
}
