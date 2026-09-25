"use client";

import { useState, useTransition } from "react";

export function DeleteButton({
  action,
  label = "Delete",
}: {
  action: () => Promise<void>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm("Delete this item? This cannot be undone.")) return;
          setError(null);
          startTransition(async () => {
            try {
              await action();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not delete this item.");
            }
          });
        }}
        className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
      >
        {pending ? "Deleting..." : label}
      </button>
      {error && <p className="max-w-48 text-right text-xs text-red-300">{error}</p>}
    </div>
  );
}
