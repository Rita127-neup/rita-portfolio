import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/supabase/admin";
import { SignOutButton } from "../sign-out-button";

export default async function AdminAccessDenied() {
  const state = await getAuthState();
  if (state.status === "signed-out") redirect("/admin/login");
  if (state.status === "admin") redirect("/admin");

  return (
    <div className="mx-auto max-w-md">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
        Admin
      </p>
      <h1 className="mt-6 text-5xl font-semibold">Access denied</h1>

      <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
        <p className="text-slate-400">
          {state.user.email ?? "This account"} is signed in but does not have
          admin access to this site.
        </p>
        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
