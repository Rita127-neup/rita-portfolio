import { ImageResponse } from "next/og";
import { getHeroPhotoPath } from "@/lib/content";
import { getPublicSupabaseClient } from "@/lib/supabase/public-client";
import { STORAGE_BUCKET } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const path = await getHeroPhotoPath();

  if (!path) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07111f",
          color: "#d0a14a",
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        R
      </div>,
      { width: 64, height: 64 },
    );
  }

  const { data, error } = await getPublicSupabaseClient()
    .storage.from(STORAGE_BUCKET)
    .createSignedUrl(path, 300);

  if (error || !data?.signedUrl) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07111f",
          color: "#d0a14a",
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        R
      </div>,
      { width: 64, height: 64 },
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: "64px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid #d0a14a",
        background: "#07111f",
      }}
    >
      <img
        src={data.signedUrl}
        alt=""
        width="88"
        height="110"
        style={{
          objectFit: "cover",
          objectPosition: "center 28%",
          transform: "scale(1.25)",
        }}
      />
    </div>,
    { width: 64, height: 64 },
  );
}
