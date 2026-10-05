export const TEXT_SCALE_VALUES = [0.9, 1, 1.125, 1.25] as const;

export type TextScale = (typeof TEXT_SCALE_VALUES)[number];

export type LineSpacing = "default" | "relaxed" | "wide";

export type LetterSpacing = "default" | "wide";

export type MotionPreference = "system" | "reduce";

export interface AccessibilityPreferences {
  textScale: TextScale;

  lineSpacing: LineSpacing;
  letterSpacing: LetterSpacing;

  highContrast: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  enhancedFocus: boolean;

  reduceMotion: MotionPreference;

  hideDecorativeImages: boolean;
  readingGuide: boolean;
}
