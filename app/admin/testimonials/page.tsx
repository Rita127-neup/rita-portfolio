import Image from "next/image";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader, AdminNav, Panel } from "../_components/admin-ui";
import { TestimonialForm, TestimonialPhotoUpload } from "./testimonial-form";
import { createTestimonial, deleteTestimonial, removeTestimonialPhoto } from "./actions";

type TestimonialRow = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image_id: string | null;
  sort_order: number;
  is_visible: boolean;
};

const input = "mt-2 w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-white";

export default async function AdminTestimonials() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, role, quote, image_id, sort_order, is_visible")
    .order("sort_order", { ascending: true });
  const testimonials = (data ?? []) as TestimonialRow[];

  return (
    <>
      <AdminNav />
      <AdminHeader
        title="Testimonials"
        text="Add the words people sent you, with their photo, like a short recommendation letter. An entry with no text yet shows a soft placeholder on the site. Untick Visible to hide it."
        backHref="/admin"
        backLabel="Back to dashboard"
      />

      <div className="mt-8">
        <Panel>
          <h2 className="text-lg font-semibold">Add testimonial</h2>
          <form action={createTestimonial} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_140px]">
              <div>
                <label htmlFor="new-name" className="text-sm text-slate-300">Name</label>
                <input id="new-name" name="name" required maxLength={200} className={input} />
              </div>
              <div>
                <label htmlFor="new-role" className="text-sm text-slate-300">Role or title</label>
                <input id="new-role" name="role" maxLength={200} className={input} />
              </div>
              <div>
                <label htmlFor="new-order" className="text-sm text-slate-300">Order</label>
                <input id="new-order" name="sort_order" type="number" min={0} max={9999} defaultValue={testimonials.length} className={input} />
              </div>
            </div>
            <div>
              <label htmlFor="new-quote" className="text-sm text-slate-300">Their words</label>
              <textarea id="new-quote" name="quote" rows={6} maxLength={8000} className={`${input} leading-7`} />
            </div>
            <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-[#07111f]">
              Add
            </button>
            <p className="text-xs text-slate-500">After adding, upload their photo from the entry below.</p>
          </form>
        </Panel>
      </div>

      <div className="mt-8 space-y-5">
        {error ? (
          <Panel><p className="text-red-300">Could not load testimonials: {error.message}</p></Panel>
        ) : (
          testimonials.map((testimonial) => (
            <Panel key={testimonial.id}>
              <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
                <TestimonialForm testimonial={testimonial} />

                <div>
                  <h2 className="text-sm font-medium text-slate-300">Photo</h2>
                  <div className="mt-4 flex min-h-28 items-center justify-center rounded-2xl border border-white/10 bg-[#07111f] p-5">
                    {testimonial.image_id ? (
                      <Image
                        src={`/media/testimonial/${testimonial.id}?v=${testimonial.image_id}`}
                        alt={testimonial.name}
                        width={112}
                        height={112}
                        unoptimized
                        className="h-28 w-28 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-slate-500">No photo</span>
                    )}
                  </div>
                  <TestimonialPhotoUpload testimonialId={testimonial.id} hasPhoto={Boolean(testimonial.image_id)} />

                  {testimonial.image_id && (
                    <form action={removeTestimonialPhoto} className="mt-3">
                      <input type="hidden" name="id" value={testimonial.id} />
                      <button type="submit" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400">
                        Remove photo
                      </button>
                    </form>
                  )}
                  <form action={deleteTestimonial} className="mt-3">
                    <input type="hidden" name="id" value={testimonial.id} />
                    <button type="submit" className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300">
                      Delete testimonial
                    </button>
                  </form>
                </div>
              </div>
            </Panel>
          ))
        )}
      </div>
    </>
  );
}
