/**
 * Testimonials for the home page.
 *
 * A quote has to be the person's own words, given by them. Until it arrives,
 * leave `quote` empty: the page then shows a quiet "to be added" line instead
 * of text nobody wrote. Delete an entry to take it off the page.
 */
export type Testimonial = {
  id: string;
  name: string;
  /** Shown under the name, for example the person's position. */
  role: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  { id: "bijay-pandey", name: "Bijay Pandey", role: "", quote: "" },
  { id: "mahabir-pun", name: "Mahabir Pun", role: "Minister for Science, Technology and Innovation", quote: "" },
];
