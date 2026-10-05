import type { AccessibilityPreferences } from "./types";

export const ACCESSIBILITY_STORAGE_KEY = "tiaki:a11y:v1";

export function readAccessibilityPreferences(): unknown | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function writeAccessibilityPreferences(
  preferences: AccessibilityPreferences,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(
      ACCESSIBILITY_STORAGE_KEY,
      JSON.stringify(preferences),
    );

    return true;
  } catch {
    return false;
  }
}

export function removeAccessibilityPreferences(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.removeItem(ACCESSIBILITY_STORAGE_KEY);

    return true;
  } catch {
    return false;
  }
}