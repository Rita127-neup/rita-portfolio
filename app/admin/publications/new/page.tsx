import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { AdminHeader, AdminNav, Panel } from "../../_components/admin-ui";
import { PublicationCreateForm } from "./publication-create-form";

export default async function NewPublication() {
  await requireAdmin();
  return <><AdminNav /><AdminHeader title="Add publication" backHref="/admin/publications" backLabel="Back to publications" /><Panel><PublicationCreateForm /></Panel></>;
}
