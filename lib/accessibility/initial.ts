import type { AccessibilityPreferences } from "./types";
import { readAccessibilityPreferences } from "./storage";
import { sanitizeAccessibilityPreferences } from "./preferences";

export function getInitialAccessibilityPreferences(): AccessibilityPreferences {
  const storedPreferences = readAccessibilityPreferences();

  return sanitizeAccessibilityPreferences(storedPreferences);
}