/**
 * Formats a number as Nigerian Naira currency.
 *
 * @example
 * formatCurrency(70000)    // "₦70,000.00"
 * formatCurrency(0)        // "₦0.00"
 * formatCurrency(null)     // "₦0.00"
 */
export function formatCurrency(value: number | null | undefined): string {
  const amount = value ?? 0;
  return `₦${new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}
