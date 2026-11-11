/**
 * Moroccan Phone Number Validation & Formatting Utility
 * Supports mobile (06, 07) and fixed lines (05) in national and international formats.
 */

// Matches +212 6/7/5..., 00212 6/7/5..., or 06/07/05... with 8 subsequent digits
const MOROCCAN_PHONE_REGEX = /^(?:\+212|00212|0)([5-7]\d{8})$/;

export function cleanPhoneNumber(rawPhone: string): string {
  // Remove all spaces, hyphens, parentheses, and dots
  return rawPhone.replace(/[\s\-\.\(\)]/g, "").trim();
}

export function isValidMoroccanPhone(rawPhone: string): boolean {
  if (!rawPhone || typeof rawPhone !== "string") return false;
  const cleaned = cleanPhoneNumber(rawPhone);
  return MOROCCAN_PHONE_REGEX.test(cleaned);
}

export function normalizeMoroccanPhone(rawPhone: string): string {
  const cleaned = cleanPhoneNumber(rawPhone);
  const match = cleaned.match(MOROCCAN_PHONE_REGEX);
  if (!match) {
    return rawPhone.trim();
  }
  // Standardize to national format: 0X XX XX XX XX
  const significantDigits = match[1]; // 9 digits starting with 5, 6, or 7
  return `0${significantDigits}`;
}

export function formatMoroccanPhoneDisplay(rawPhone: string): string {
  const normalized = normalizeMoroccanPhone(rawPhone);
  if (normalized.length === 10 && normalized.startsWith("0")) {
    // 06 12 34 56 78
    return `${normalized.slice(0, 2)} ${normalized.slice(2, 4)} ${normalized.slice(4, 6)} ${normalized.slice(6, 8)} ${normalized.slice(8, 10)}`;
  }
  return rawPhone;
}
