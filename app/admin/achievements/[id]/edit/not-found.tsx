import { NotFoundPanel } from "../../../_components/admin-ui";

export default function AchievementNotFound() {
  return (
    <NotFoundPanel
      eyebrow="Edit achievement"
      title="Achievement not found"
      text="This achievement does not exist or the link is invalid."
      backHref="/admin/achievements"
      backLabel="Back to achievements"
    />
  );
}
