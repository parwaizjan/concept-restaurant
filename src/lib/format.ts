import { site } from "../data/site";

/** Format a price in the configured currency, e.g. `Rs. 1,450`. */
export function formatPrice(amount: number): string {
  const value = new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${site.currency.symbol} ${value}`;
}
