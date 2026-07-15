/**
 * Formats a `Date` as a calendar date using its **local** parts.
 *
 * Use this instead of `toISOString()` for calendar dates (pickup days, etc.).
 * `toISOString()` converts to UTC, so local midnight in any timezone ahead of
 * UTC reports the previous day — e.g. 25 Jul at UTC+1 becomes "2026-07-24".
 *
 * @example toLocalDateKey(new Date(2026, 6, 25)) // "2026-07-25"
 */
export function toLocalDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Formats a `Date` as a `YYYY-MM` month key from its **local** parts.
 *
 * @example toLocalMonthKey(new Date(2026, 6, 25)) // "2026-07"
 */
export function toLocalMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

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
