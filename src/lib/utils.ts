import { cn } from "cn";
import type { CurrencyCode } from "./types";

export { cn };

/**
 * Format currency using Intl.NumberFormat
 * Supports USD, EUR, GBP, INR
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "USD"
): string {
  const locales: Record<CurrencyCode, string> = {
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    INR: "en-IN",
  };

  const locale = locales[currency] ?? "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date string into readable format (e.g., Oct 24, 2026)
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat(
      "en-US",
      options ?? {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    ).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculate days remaining until a deadline date string (YYYY-MM-DD).
 * Should be called on client or after mount to avoid hydration mismatch.
 */
export function daysUntil(dateString: string): number {
  if (!dateString) return 0;
  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) return 0;
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
