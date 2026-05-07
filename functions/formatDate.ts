/**
 * Formats an ISO 8601 date string into a human-readable date and time.
 * @example formatDate("2026-02-27T08:16:55.367Z") // "27 Feb 2026, 08:16 AM"
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";

  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart}, ${timePart}`;
}

/**
 * Returns only the date portion.
 * @example formatDateOnly("2026-02-27T08:16:55.367Z") // "27 Feb 2026"
 */
export function formatDateOnly(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Returns only the time portion.
 * @example formatTimeOnly("2026-02-27T08:16:55.367Z") // "08:16 AM"
 */
export function formatTimeOnly(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
