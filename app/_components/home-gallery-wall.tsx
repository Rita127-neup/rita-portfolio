"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = { id: string; src: string; alt: string };

export function HomeGalleryWall({ photos }: { photos: Photo[] }) {
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
      <section className="border-t border-[#d8cfbb] px-6 py-12 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="section-label">Photo journal</p>
            <h2 className="section-title">A few moments along the way.</h2>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {photos.map((photo, index) => (
              <article key={photo.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`Open photo ${index + 1} larger`}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#d8cfbb] bg-[#e5dcc9] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9a742d]"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                    Enlarge ↗
                  </span>
                </button>
                <p className="mt-3 text-sm leading-6 text-[#555b55]">{photo.alt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded photo"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/95 p-4 sm:p-8"
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
