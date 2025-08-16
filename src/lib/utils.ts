import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateFriendly(
  value?: string | Date | null,
): string | undefined {
  if (!value) return undefined;
  try {
    const d = typeof value === "string" ? parseISO(value) : value;
    if (!isValid(d)) return typeof value === "string" ? value : undefined;
    return format(d, "EEE, MMM d, yyyy");
  } catch {
    return typeof value === "string" ? value : undefined;
  }
}
