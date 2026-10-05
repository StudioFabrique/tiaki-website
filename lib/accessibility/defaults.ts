import type {
  AccessibilityPreferences,
  LetterSpacing,
  LineSpacing,
  TextScale,
} from "./types";

export const TEXT_SCALE_OPTIONS = [
  { value: 0.9, labelKey: "smaller" },
  { value: 1, labelKey: "default" },
  { value: 1.125, labelKey: "large" },
  { value: 1.25, labelKey: "larger" },
] as const satisfies ReadonlyArray<{
  value: TextScale;
  labelKey: string;
}>;

export const LINE_SPACING_OPTIONS = [
  { value: "default", labelKey: "default" },
  { value: "relaxed", labelKey: "relaxed" },
  { value: "wide", labelKey: "wide" },
] as const satisfies ReadonlyArray<{
  value: LineSpacing;
  labelKey: string;
}>;

export const LETTER_SPACING_OPTIONS = [
  { value: "default", labelKey: "default" },
  { value: "wide", labelKey: "wide" },
] as const satisfies ReadonlyArray<{
  value: LetterSpacing;
  labelKey: string;
}>;

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  textScale: 1,
  lineSpacing: "default",
  letterSpacing: "default",
  highContrast: false,
  grayscale: false,
  underlineLinks: false,
  enhancedFocus: false,
  reduceMotion: "system",
  hideDecorativeImages: false,
  readingGuide: false,
};