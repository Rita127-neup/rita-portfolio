"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = { src: string; alt: string };

export function HomePhotoGallery({
  photoUrl,
  photoAlt,
  placeholderInitials,
  birthday,
  photos,
}: {
  photoUrl?: string;
  photoAlt: string;
  placeholderInitials: string;
  birthday: string;
  photos: Photo[];
}) {
  const allPhotos = [
    ...(photoUrl ? [{ src: photoUrl, alt: photoAlt }] : []),
    ...photos,
  ];
  const [active, setActive] = useState(0);
  const current = allPhotos[active];

  return (
    <div>
      <div className="relative overflow-hidden rounded-[1.5rem] bg-[#dedbd2]">
        {current ? (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={800}
            height={1000}
            unoptimized
            priority
            className="aspect-[4/5] w-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center">
            <span className="font-display text-5xl text-[#9a742d]">{placeholderInitials}</span>
          </div>
        )}
        {birthday && (
          <div className="absolute bottom-4 left-4 rounded-full border border-white/50 bg-[#fbf6e8]/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#454a55] backdrop-blur-sm">
            Born {birthday}
          </div>
        )}
        {allPhotos.length > 1 && (
          <span className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white">
            {active + 1} / {allPhotos.length}
          </span>
        )}
      </div>
      {allPhotos.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2" aria-label="Choose a photo">
          {allPhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={active === index}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${active === index ? "border-[#9a742d] opacity-100" : "border-transparent opacity-65 hover:opacity-100"}`}
            >
              <Image src={photo.src} alt="" fill unoptimized sizes="5rem" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
