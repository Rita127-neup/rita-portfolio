/** Small line icons for the contact list. Anything unrecognised gets a plain link icon. */
export function SocialIcon({ label, className = "h-[18px] w-[18px]" }: { label: string; className?: string }) {
  const key = label.trim().toLowerCase();
  const common = {
    viewBox: "0 0 24 24",
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (key === "github") {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
      </svg>
    );
  }
  if (key === "linkedin") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3.5" />
        <path d="M8 10.5v6M8 7.6v.1M12 16.5v-6M12 13.2c0-1.7 1-2.7 2.4-2.7s2.1 1 2.1 2.6v3.4" />
      </svg>
    );
  }
  if (key === "facebook") {
    return (
      <svg {...common}>
        <path d="M13.6 21v-8h2.6l.4-3.1h-3V8c0-.9.3-1.5 1.5-1.5h1.6V3.7c-.3 0-1.2-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.4H8v3.1h2.5v8" />
      </svg>
    );
  }
  if (key === "orcid") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.2" />
        <path d="M8.6 10.2v6.3M8.6 7.4v.1M11.8 10.2h2c2.2 0 3.3 1.3 3.3 3.2s-1.1 3.1-3.3 3.1h-2z" />
      </svg>
    );
  }
  if (key === "email" || key === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7.5 8 6 8-6" />
      </svg>
    );
  }
  if (key.includes("scholar")) {
    return (
      <svg {...common}>
        <path d="m12 4 9 4.5-9 4.5-9-4.5z" />
        <path d="M7 11.2V15c0 1.4 2.2 2.8 5 2.8s5-1.4 5-2.8v-3.8" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  );
}
