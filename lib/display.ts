/** Drop a trailing arrow typed into a link label, so the page can add its own. */
export function plainLabel(label: string) {
  return label.replace(/\s*[→↗↘➜]+\s*$/u, "");
}

/** "Rita" + "Neupane." -> "Rita Neupane". The stored last name ends in a dot that the old hero styled separately. */
export function displayName(first: string, last: string) {
  return [first, last].filter(Boolean).join(" ").replace(/[.\s]+$/u, "");
}

/** 2007-08-24 -> "24 August 2007". Anything that is not a plain ISO date is shown as typed. */
export function formatBirthday(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
