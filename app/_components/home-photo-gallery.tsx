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
      <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-[#fbd9e6] shadow-[0_14px_34px_rgba(184,58,116,0.2)]">
        {current ? (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            width={800}
            height={1000}
            unoptimized
            priority
            className="aspect-[4/5] w-full scale-[1.08] object-cover object-[50%_30%] transition-opacity duration-300"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center">
            <span className="font-display text-5xl text-[#b83a74]">{placeholderInitials}</span>
          </div>
        )}
        {birthday && (
          <div className="absolute bottom-4 left-4 rounded-full border border-white/50 bg-[#fff8fb]/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5b2c43] backdrop-blur-sm">
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
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${active === index ? "border-[#b83a74] opacity-100" : "border-transparent opacity-65 hover:opacity-100"}`}
            >
              <Image src={photo.src} alt="" fill unoptimized sizes="5rem" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
