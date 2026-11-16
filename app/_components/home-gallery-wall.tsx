"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SectionShell } from "@/app/_components/section-shell";

type Photo = { id: string; src: string; alt: string };

/*
  Widths, tilts and drops, reused in order. Each photo keeps its own shape (nothing
  is cropped, so people at the edge of a group photo stay in the frame). Widths and
  drops differ so the rows look casually scattered, and because nothing is random
  the server and the browser always render the same layout.
*/
const SCATTER = [
  { size: "w-[54%] sm:w-[44%]", tilt: "rotate-[-2.5deg]", drop: "mt-0" },
  { size: "w-[38%] sm:w-[38%]", tilt: "rotate-[3deg]", drop: "mt-8" },
  { size: "w-[44%] sm:w-[28%]", tilt: "rotate-[-1.5deg]", drop: "mt-3" },
  { size: "w-[48%] sm:w-[30%]", tilt: "rotate-[2deg]", drop: "mt-10" },
  { size: "w-[40%] sm:w-[32%]", tilt: "rotate-[-3deg]", drop: "mt-1" },
  { size: "w-[50%] sm:w-[36%]", tilt: "rotate-[1.5deg]", drop: "mt-6" },
  { size: "w-[42%] sm:w-[46%]", tilt: "rotate-[-2deg]", drop: "mt-12" },
  { size: "w-[52%] sm:w-[30%]", tilt: "rotate-[2.5deg]", drop: "mt-2" },
  { size: "w-[36%] sm:w-[26%]", tilt: "rotate-[-1deg]", drop: "mt-9" },
  { size: "w-[46%] sm:w-[34%]", tilt: "rotate-[1deg]", drop: "mt-4" },
];

export function HomeGalleryWall({ photos, standalone = false }: { photos: Photo[]; standalone?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((current) => current === null ? null : (current + 1) % photos.length);
      if (event.key === "ArrowLeft") setSelected((current) => current === null ? null : (current - 1 + photos.length) % photos.length);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected, photos.length]);

  if (photos.length === 0) return null;

  const current = selected === null ? null : photos[selected];

  return (
    <>
      {standalone ? (
        <div id="journal">
        <p className="pt-1 text-sm text-[#7b6670]">A few moments along the way.</p>
        <div className="flex flex-wrap items-start justify-around gap-x-3 gap-y-6 pb-4 pt-6">
          {photos.map((photo, index) => {
            const look = SCATTER[index % SCATTER.length];
            return (
              <article
                key={photo.id}
                className={`${look.size} ${look.drop} ${look.tilt} transition-transform duration-300 hover:z-10 hover:rotate-0`}
              >
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`Open photo ${index + 1} larger`}
                  title={photo.alt || undefined}
                  className="block w-full cursor-zoom-in bg-white p-1.5 text-left shadow-[0_2px_10px_rgba(43,32,38,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#96506f]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1200}
                    height={800}
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 300px"
                    className="block h-auto w-full bg-[#e8e1e3]"
                  />
                </button>
              </article>
            );
          })}
        </div>
</div>
      ) : (
        <SectionShell id="journal" title="Photo journal">
        <p className="pt-1 text-sm text-[#7b6670]">A few moments along the way.</p>
        <div className="flex flex-wrap items-start justify-around gap-x-3 gap-y-6 pb-4 pt-6">
          {photos.map((photo, index) => {
            const look = SCATTER[index % SCATTER.length];
            return (
              <article
                key={photo.id}
                className={`${look.size} ${look.drop} ${look.tilt} transition-transform duration-300 hover:z-10 hover:rotate-0`}
              >
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`Open photo ${index + 1} larger`}
                  title={photo.alt || undefined}
                  className="block w-full cursor-zoom-in bg-white p-1.5 text-left shadow-[0_2px_10px_rgba(43,32,38,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#96506f]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1200}
                    height={800}
                    unoptimized
                    sizes="(max-width: 640px) 50vw, 300px"
                    className="block h-auto w-full bg-[#e8e1e3]"
                  />
                </button>
              </article>
            );
          })}
        </div>
</SectionShell>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded photo"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2a1b22]/95 p-4 sm:p-8"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close expanded photo"
            className="absolute right-4 top-4 z-10 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Close ✕
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(event) => { event.stopPropagation(); setSelected((selected! - 1 + photos.length) % photos.length); }}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-4 py-3 text-xl text-white hover:bg-black/75 sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(event) => { event.stopPropagation(); setSelected((selected! + 1) % photos.length); }}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-4 py-3 text-xl text-white hover:bg-black/75 sm:right-6"
              >
                ›
              </button>
            </>
          )}
          <div className="flex max-h-full max-w-full flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-[min(78vh,900px)] w-[min(90vw,1200px)]">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                unoptimized
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-4 max-w-3xl text-center text-sm leading-6 text-white/85">{current.alt}</p>
            <p className="mt-1 text-xs text-white/50">{selected! + 1} / {photos.length}</p>
          </div>
        </div>
      )}
    </>
  );
}
