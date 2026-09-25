// Shared form parsing and validation for the admin CMS. Pure functions, used
// by the Server Functions; the database constraints remain the final check.

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/** Field name (as used in the form) -> error message. */
export type FieldErrors = Record<string, string>;

/** State returned by every admin save action to its form. */
export type FormState<V> = {
  error: string | null;
  fieldErrors: FieldErrors;
  values: V | null;
};

export function initialFormState<V>(): FormState<V> {
  return { error: null, fieldErrors: {}, values: null };
}

export function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function readCheckbox(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

/** Required text with a maximum length. Returns an error message or null. */
export function checkRequired(value: string, max: number): string | null {
  if (!value) return "This field is required.";
  if (value.length > max) return `Keep this under ${max} characters.`;
  return null;
}

export function checkOptional(value: string, max: number): string | null {
  return value.length > max ? `Keep this under ${max} characters.` : null;
}

/** Comma-separated tags -> unique, trimmed list. */
export function parseTags(
  value: string,
): { ok: true; tags: string[] } | { ok: false; error: string } {
  const tags = [
    ...new Set(
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
  if (tags.length > 20) return { ok: false, error: "Use at most 20 tags." };
  if (tags.some((tag) => tag.length > 50))
    return { ok: false, error: "Keep each tag under 50 characters." };
  return { ok: true, tags };
}

/** Optional absolute http(s) URL. Empty input -> null. */
export function parseHttpUrl(
  value: string,
): { ok: true; url: string | null } | { ok: false; error: string } {
  if (!value) return { ok: true, url: null };
  if (value.length > 2000)
    return { ok: false, error: "Keep this under 2000 characters." };
  if (!/^https?:\/\//i.test(value))
    return { ok: false, error: "Links must start with http:// or https://." };
  try {
    new URL(value);
    return { ok: true, url: value };
  } catch {
    return { ok: false, error: "Enter a valid URL." };
  }
}

/**
 * Link target for site buttons: an internal path ("/about"), an absolute
 * http(s) URL, or a mailto: address. Protocol-relative "//host" is rejected.
 */
export function parseHref(
  value: string,
): { ok: true; href: string } | { ok: false; error: string } {
  if (!value) return { ok: false, error: "This field is required." };
  if (value.length > 2000)
    return { ok: false, error: "Keep this under 2000 characters." };
  if (/^\/(?!\/)[A-Za-z0-9\-._~/#?=&%]*$/.test(value))
    return { ok: true, href: value };
  if (/^mailto:[^@\s]+@[^@\s]+$/i.test(value)) return { ok: true, href: value };
  const url = parseHttpUrl(value);
  if (url.ok && url.url) return { ok: true, href: url.url };
  return {
    ok: false,
    error: "Use a site path like /contact, an https:// link, or mailto:.",
  };
}

/** Optional ISO date (YYYY-MM-DD). Empty input -> null. */
export function parseDate(
  value: string,
): { ok: true; date: string | null } | { ok: false; error: string } {
  if (!value) return { ok: true, date: null };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    return { ok: false, error: "Enter a date as YYYY-MM-DD." };
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    return { ok: false, error: "Enter a real date." };
  return { ok: true, date: value };
}

/** Display position: a whole number from 0 to 9999. */
export function parseSortOrder(
  value: string,
): { ok: true; order: number } | { ok: false; error: string } {
  if (!/^\d{1,4}$/.test(value))
    return { ok: false, error: "Enter a whole number from 0 to 9999." };
  return { ok: true, order: Number(value) };
}

export function isEmail(value: string): boolean {
  return value.length <= 320 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}
