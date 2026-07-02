/**
 * Centralized, typed access to public environment variables.
 *
 * All values are `NEXT_PUBLIC_*` (available in the browser). Import from here
 * instead of reading `process.env` directly across the codebase.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
export const PAYSTACK_SECRET = process.env.NEXT_PUBLIC_PAYSTACK_SECRET ?? "";

// tawk.to live chat
export const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID ?? "";
export const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID ?? "";
export const TAWK_SRC = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
