import { requireAdmin } from "@/lib/supabase/admin";
import { AdminHeader, AdminNav, Panel } from "../../_components/admin-ui";
import { AchievementCreateForm } from "./achievement-create-form";
export default async function NewAchievement(){await requireAdmin();return <><AdminNav/><AdminHeader title="Add achievement" backHref="/admin/achievements" backLabel="Back to achievements"/><Panel><AchievementCreateForm/></Panel></>;}
