import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type SupportedCurrency = "PHP" | "USD" | "EUR" | "GBP" | "SGD" | "JPY" | "AUD";

export const CURRENCY_RATES: Record<SupportedCurrency, { symbol: string; rateFromPhp: number; name: string }> = {
  PHP: { symbol: "₱", rateFromPhp: 1.0, name: "Philippine Peso" },
  USD: { symbol: "$", rateFromPhp: 0.018, name: "US Dollar" },
  EUR: { symbol: "€", rateFromPhp: 0.016, name: "Euro" },
  GBP: { symbol: "£", rateFromPhp: 0.014, name: "British Pound" },
  SGD: { symbol: "S$", rateFromPhp: 0.024, name: "Singapore Dollar" },
  JPY: { symbol: "¥", rateFromPhp: 2.65, name: "Japanese Yen" },
  AUD: { symbol: "A$", rateFromPhp: 0.027, name: "Australian Dollar" },
};

export function formatCurrency(
  amountInPhp: number | string | null | undefined,
  targetCurrency: SupportedCurrency = "PHP"
): string {
  if (amountInPhp === null || amountInPhp === undefined || amountInPhp === "") return "₱0.00";
  const numInPhp = typeof amountInPhp === "string" ? parseFloat(amountInPhp) : amountInPhp;
  if (isNaN(numInPhp)) return "₱0.00";

  const config = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.PHP;
  const converted = numInPhp * config.rateFromPhp;

  if (targetCurrency === "JPY") {
    return `¥${Math.round(converted).toLocaleString("en-US")}`;
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: targetCurrency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}
