import { NotFoundPanel } from "../../../_components/admin-ui";

export default function ResearchNotFound() {
  return (
    <NotFoundPanel
      eyebrow="Edit research"
      title="Research item not found"
      text="This research item does not exist or the link is invalid."
      backHref="/admin/research"
      backLabel="Back to research"
    />
  );
}
