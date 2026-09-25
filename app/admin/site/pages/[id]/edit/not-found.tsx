import { NotFoundPanel } from "../../../../_components/admin-ui";

export default function PageNotFound() {
  return (
    <NotFoundPanel
      eyebrow="Edit page"
      title="Page not found"
      text="This page does not exist, cannot be edited here, or the link is invalid."
      backHref="/admin/site"
      backLabel="Back to site & pages"
    />
  );
}
