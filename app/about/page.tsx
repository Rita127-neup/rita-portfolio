import { redirect } from "next/navigation";

/** About lives on the home page now; old links to /about land there. */
export default function About() {
  redirect("/#about");
}
