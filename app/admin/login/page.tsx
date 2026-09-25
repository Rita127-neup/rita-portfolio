import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/supabase/admin";
import { LoginForm } from "./login-form";

export default async function AdminLogin() {
  const state = await getAuthState();
  if (state.status === "admin") redirect("/admin");
  if (state.status === "not-admin") redirect("/admin/denied");

  return (
    <div className="mx-auto max-w-md">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
        Admin
      </p>
      <h1 className="mt-6 text-5xl font-semibold">Sign in</h1>

      <div className="mt-12 rounded-3xl border border-white/10 bg-[#0c1a2d] p-8">
        <LoginForm />
      </div>
    </div>
  );
}
