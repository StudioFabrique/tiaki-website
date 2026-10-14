// Ce registre apporte trois garanties :
// - VISIBILITY_CONTROLS ne peut contenir que des préférences booléennes existantes.
// - VisibilitySectionContent exige un titre et une description pour chaque contrôle déclaré.
// - L'ordre d'affichage est défini à un seul endroit.

import {
  TEXT_SCALE_OPTIONS,
  LINE_SPACING_OPTIONS,
  LETTER_SPACING_OPTIONS,
} from "./defaults"

import type {
  AccessibilityPreferences,
  TextScale,
  LineSpacing,
  LetterSpacing,
  MotionPreference,
} from "./types"

/**
 * Only preferences with boolean values
 * can use BooleanPreferenceControl.
 */
export type BooleanPreferenceKey = {
  [
    K in keyof AccessibilityPreferences
  ]-?: AccessibilityPreferences[K] extends boolean ? K : never
}[keyof AccessibilityPreferences]

/**
 * Visibility section controls.
 * The array order determines the display order.
 */
export const VISIBILITY_CONTROLS = [
  "highContrast",
  "grayscale",
  "hideDecorativeImages",
  "underlineLinks",
  "enhancedFocus",
] as const satisfies readonly BooleanPreferenceKey[]

export type VisibilityControlKey = (typeof VISIBILITY_CONTROLS)[number]

export type VisibilityControlContent = {
  title: string
  description: string
}

export type VisibilitySectionContent = {
  title: string
} & Record<VisibilityControlKey, VisibilityControlContent>

/* =======Choice Preferences Registry========================== */

const LINE_SPACING_PREVIEW: Record<LineSpacing, string> = {
  default: "≡",
  relaxed: "☰",
  wide: "↕",
}

const LETTER_SPACING_PREVIEW: Record<LetterSpacing, string> = {
  default: "Aa",
  wide: "A a",
}

const TEXT_SCALE_PREVIEW: Record<TextScale, string> = {
  0.9: "A−",
  1: "A",
  1.125: "A+",
  1.25: "A++",
}

const MOTION_OPTIONS = [
  {
    value: "system",
    labelKey: "system",
  },
  {
    value: "reduce",
    labelKey: "reduce",
  },
] as const satisfies readonly {
  value: MotionPreference
  labelKey: MotionPreference
}[]

export const CHOICE_CONTROLS = {
  textScale: {
    name: "accessibility-text-scale",
    options: TEXT_SCALE_OPTIONS.map((option) => ({
      ...option,
      preview: TEXT_SCALE_PREVIEW[option.value],
    })),
  },

  lineSpacing: {
    name: "accessibility-line-spacing",
    options: LINE_SPACING_OPTIONS.map((option) => ({
      ...option,
      preview: LINE_SPACING_PREVIEW[option.value],
    })),
  },

  letterSpacing: {
    name: "accessibility-letter-spacing",
    options: LETTER_SPACING_OPTIONS.map((option) => ({
      ...option,
      preview: LETTER_SPACING_PREVIEW[option.value],
    })),
    density: "compact" as const,
  },

  reduceMotion: {
    name: "accessibility-reduce-motion",
    options: MOTION_OPTIONS,
  },
} as const

export type ChoiceControlKey = keyof typeof CHOICE_CONTROLS

export type ChoiceControlContent<K extends ChoiceControlKey> = {
  title: string
  description: string
  options: Record<
    (typeof CHOICE_CONTROLS)[K]["options"][number]["labelKey"],
    string
  >
}


/* =========================================
   Choice Section Content Types
   ========================================= */

export type ChoiceSectionContent<
  Section extends keyof typeof CHOICE_CONTROL_SECTIONS> = {
    title: string
  } & {
    [K in (typeof CHOICE_CONTROL_SECTIONS)[Section][number]]:
      ChoiceControlContent<K>
}

/* =========================================
   Choice Controls — Section Registry
   ========================================= */

export const CHOICE_CONTROL_SECTIONS = {
  textAndReading: [
    "textScale",
    "lineSpacing",
    "letterSpacing",
  ],

  motion: [
    "reduceMotion",
  ],
} as const satisfies Record<
  "textAndReading" | "motion",
  readonly ChoiceControlKey[]
>
