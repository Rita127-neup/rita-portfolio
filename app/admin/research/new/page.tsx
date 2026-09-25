import { requireAdmin } from "@/lib/supabase/admin";
import { AdminHeader, AdminNav, Panel } from "../../_components/admin-ui";
import { ResearchCreateForm } from "./research-create-form";
export default async function NewResearch(){await requireAdmin();return <><AdminNav/><AdminHeader title="Add research item" backHref="/admin/research" backLabel="Back to research"/><Panel><ResearchCreateForm/></Panel></>;}
