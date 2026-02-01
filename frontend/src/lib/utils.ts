import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// Bu dosyada genel amaçlı yardımcı fonksiyonlar bulunur.
// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display format
export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB").format(date);
}

// Format date to ISO format (YYYY-MM-DD)
export function toIsoDate(value: Date): string {
  return value.toISOString().split("T")[0];
}

// Format date with time
export function formatDateTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Generate a simple unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Truncate text with ellipsis
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
