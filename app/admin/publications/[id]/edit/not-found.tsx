import { NotFoundPanel } from "../../../_components/admin-ui";

export default function PublicationNotFound() {
  return (
    <NotFoundPanel
      eyebrow="Edit publication"
      title="Publication not found"
      text="This publication does not exist or the link is invalid."
      backHref="/admin/publications"
      backLabel="Back to publications"
    />
  );
}
