import { requireAdmin } from "@/lib/supabase/admin";
import { AdminHeader, AdminNav, Panel } from "../../_components/admin-ui";
import { ExperienceCreateForm } from "./experience-create-form";
export default async function NewExperience(){await requireAdmin();return <><AdminNav/><AdminHeader title="Add experience" backHref="/admin/experiences" backLabel="Back to experiences"/><Panel><ExperienceCreateForm/></Panel></>;}
