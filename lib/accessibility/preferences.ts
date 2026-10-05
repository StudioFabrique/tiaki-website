import {
  DEFAULT_ACCESSIBILITY_PREFERENCES,
  LETTER_SPACING_OPTIONS,
  LINE_SPACING_OPTIONS,
  TEXT_SCALE_OPTIONS,
} from "./defaults";

import type {
  AccessibilityPreferences,
  MotionPreference,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionValue<T extends string | number>(
  options: ReadonlyArray<{ value: T }>,
  value: unknown,
): value is T {
  return options.some((option) => option.value === value);
}

function isMotionPreference(value: unknown): value is MotionPreference {
  return value === "system" || value === "reduce";
}

function booleanOrDefault(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function sanitizeAccessibilityPreferences(
  value: unknown,
): AccessibilityPreferences {
  const defaults = DEFAULT_ACCESSIBILITY_PREFERENCES;

  if (!isRecord(value)) {
    return { ...defaults };
  }

  return {
    textScale: isOptionValue(TEXT_SCALE_OPTIONS, value.textScale)
      ? value.textScale
      : defaults.textScale,

    lineSpacing: isOptionValue(LINE_SPACING_OPTIONS, value.lineSpacing)
      ? value.lineSpacing
      : defaults.lineSpacing,

    letterSpacing: isOptionValue(LETTER_SPACING_OPTIONS, value.letterSpacing)
      ? value.letterSpacing
      : defaults.letterSpacing,

    highContrast: booleanOrDefault(
      value.highContrast,
      defaults.highContrast,
    ),

    grayscale: booleanOrDefault(value.grayscale, defaults.grayscale),

    underlineLinks: booleanOrDefault(
      value.underlineLinks,
      defaults.underlineLinks,
    ),

    enhancedFocus: booleanOrDefault(
      value.enhancedFocus,
      defaults.enhancedFocus,
    ),

    reduceMotion: isMotionPreference(value.reduceMotion)
      ? value.reduceMotion
      : defaults.reduceMotion,

    hideDecorativeImages: booleanOrDefault(
      value.hideDecorativeImages,
      defaults.hideDecorativeImages,
    ),

    readingGuide: booleanOrDefault(
      value.readingGuide,
      defaults.readingGuide,
    ),
  };
}