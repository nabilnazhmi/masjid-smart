import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian Rupiah string
 * Example: 5000000 -> "Rp 5.000.000"
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Rp 0";
  }
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted.replace("IDR", "Rp").trim();
}

/**
 * Format ISO date string to localized Indonesian Date
 * Example: "2026-10-27" -> "27 Oktober 2026"
 */
export function formatDateIndo(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format ISO datetime string to Indonesian Date and Time
 * Example: "27 Oktober 2026, 18:30 WIB"
 */
export function formatDateTimeIndo(dateTimeString?: string | null): string {
  if (!dateTimeString) return "-";
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString;
    const datePart = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
    const timePart = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);

    return `${datePart}, ${timePart} WIB`;
  } catch {
    return dateTimeString;
  }
}

export function formatTimeOnly(dateTimeString?: string | null): string {
  if (!dateTimeString) return "-";
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString;
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return dateTimeString;
  }
}
