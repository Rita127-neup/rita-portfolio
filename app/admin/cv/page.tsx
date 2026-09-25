import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CV_MAX_BYTES } from "@/lib/storage";
import { AdminHeader, AdminNav, Panel, SavedNotice } from "../_components/admin-ui";
import { ConfirmRemoveButton, UploadForm } from "../_components/upload-form";
import { registerCv, removeCv } from "./actions";

type CvRow = {
  title: string;
  created_at: string;
  media: { size_bytes: number | null } | null;
};

function formatSize(bytes: number | null | undefined) {
  if (!bytes) return null;
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function AdminCv({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; removed?: string; error?: string }>;
}) {
  // Authorize before touching any CV data.
  await requireAdmin();

  const { saved, removed, error: actionError } = await searchParams;

  // Reads with the signed-in user's session, so RLS still applies.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cv_documents")
    .select("title, created_at, media:media_assets(size_bytes)")
    .eq("is_current", true)
    .maybeSingle<CvRow>();

  const size = formatSize(data?.media?.size_bytes);

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="CV"
        text="The PDF visitors download from the home page."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <SavedNotice show={saved === "1"} text="CV uploaded." />
      <SavedNotice show={removed === "1"} text="CV removed from the site." />
      {actionError === "remove" && (
        <p role="alert" className="mt-8 text-sm text-red-300">
          The CV could not be removed. Please try again.
        </p>
      )}

      <Panel>
        <h2 className="text-2xl font-semibold">Current CV</h2>
        {error ? (
          <p role="alert" className="mt-4 text-red-300">
            Could not load the current CV. Please try again.
          </p>
        ) : data ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-slate-300">{data.title}</p>
              <p className="mt-1 text-sm text-slate-500">
                Uploaded {new Date(data.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
                {size && ` · ${size}`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/cv"
                target="_blank"
                rel="noopener"
                className="text-sm text-cyan-300 transition hover:text-cyan-200"
              >
                Download ↗
              </a>
              <form action={removeCv}>
                <ConfirmRemoveButton
                  label="Remove"
                  confirmText="Remove the CV from the site? The file will be deleted."
                />
              </form>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-400">
            No CV uploaded. The download button is hidden until you upload one.
          </p>
        )}
      </Panel>

      <Panel>
        <h2 className="mb-6 text-2xl font-semibold">
          {data ? "Replace CV" : "Upload CV"}
        </h2>
        <UploadForm
          folder="cv"
          types={{ "application/pdf": "pdf" }}
          maxBytes={CV_MAX_BYTES}
          fileLabel="PDF file"
          fileHint="PDF only, up to 10 MB. Replacing deletes the previous file."
          textField={{
            name: "title",
            label: "Title",
            defaultValue: data?.title ?? "CV",
            maxLength: 100,
            hint: 'Shown on the button as "Download <title>" and used as the file name.',
          }}
          submitLabel={data ? "Upload and replace" : "Upload"}
          register={registerCv}
        />
      </Panel>
    </>
  );
}
