"use client";

import { useRef, useState } from "react";

/** A small play button for the voice note that says the name. Rendered only when a recording exists. */
export function PronunciationPlayer({ src }: { src: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Stop the recording of my name" : "Hear how my name is said"}
        className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#e6efe8] px-3 py-1 text-xs text-[#3f6450] transition-colors hover:bg-[#d9e8dd]"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M7 6h4v12H7zM13 6h4v12h-4z" /> : <path d="M8 5.5v13l11-6.5z" />}
        </svg>
        <span>{playing ? "Playing…" : "Hear it"}</span>
      </button>
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </>
  );
}
