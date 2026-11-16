import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { aboutCopy, aboutExtras } from "@/lib/content/copy";
import { AdminHeader, AdminNav, Panel } from "../_components/admin-ui";
import { AboutForm, VoiceUpload } from "./about-form";

export const dynamic = "force-dynamic";

export default async function AdminAbout() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: settings }, { data: section }] = await Promise.all([
    supabase.from("site_settings").select("about_paragraphs, languages, hobbies, pronunciation_audio_id").eq("id", 1).single(),
    supabase
      .from("page_sections")
      .select("body, page:pages!inner(slug)")
      .eq("section_key", "name_pronunciation")
      .eq("page.slug", "home")
      .maybeSingle(),
  ]);

  // Show the text that is live on the site when nothing has been saved yet.
  const paragraphs = settings?.about_paragraphs?.trim() || aboutCopy.paragraphs.join("\n\n");
  const languages =
    settings?.languages?.trim() || aboutExtras.languages.map((l) => (l.level ? `${l.name} | ${l.level}` : l.name)).join("\n");
  const hobbies = settings?.hobbies?.trim() || aboutExtras.hobbies.join("\n");

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="About me"
        text="The biography, languages, hobbies and the voice note for your name. Everything here shows on the home page."
        backHref="/admin"
        backLabel="Back to dashboard"
      />

      <Panel>
        <h2 className="text-2xl font-semibold">Words</h2>
        <div className="mt-6">
          <AboutForm paragraphs={paragraphs} languages={languages} hobbies={hobbies} pronunciation={section?.body ?? ""} />
        </div>
      </Panel>

      <Panel>
        <h2 className="text-2xl font-semibold">Voice note: how my name is said</h2>
        <p className="mt-3 text-slate-400">
          Record a few seconds saying your name on your phone (the voice recorder app is fine) and upload the file here. Visitors see a small &ldquo;Hear it&rdquo; button under your name.
        </p>
        <div className="mt-6 max-w-md">
          {settings?.pronunciation_audio_id && (
            <audio controls preload="none" src={`/media/pronunciation?v=${settings.pronunciation_audio_id}`} className="mb-5 w-full" />
          )}
          <VoiceUpload hasAudio={Boolean(settings?.pronunciation_audio_id)} />
        </div>
      </Panel>
    </>
  );
}
