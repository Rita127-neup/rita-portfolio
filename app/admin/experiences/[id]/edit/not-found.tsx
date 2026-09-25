import { NotFoundPanel } from "../../../_components/admin-ui";

export default function ExperienceNotFound() {
  return (
    <NotFoundPanel
      eyebrow="Edit experience"
      title="Experience not found"
      text="This experience does not exist or the link is invalid."
      backHref="/admin/experiences"
      backLabel="Back to experiences"
    />
  );
}
