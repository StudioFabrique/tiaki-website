"use client";

import { LETTER_SPACING_OPTIONS } from "@/lib/accessibility/defaults";
import type { LetterSpacing } from "@/lib/accessibility/types";

import { useAccessibility } from "../AccessibilityProvider";

type LetterSpacingLabelKey =
  (typeof LETTER_SPACING_OPTIONS)[number]["labelKey"];

export type LetterSpacingControlContent = {
  title: string;
  description: string;
  options: Record<LetterSpacingLabelKey, string>;
};

type LetterSpacingControlProps = {
  content: LetterSpacingControlContent;
};

const LETTER_SPACING_PREVIEW: Record<LetterSpacing, string> = {
  default: "Aa",
  wide: "A a",
};

export function LetterSpacingControl({
  content,
}: LetterSpacingControlProps) {
  const {
    preferences,
    updatePreference,
  } = useAccessibility();

  return (
    <fieldset
      className="
        rounded-2xl
        border border-border
        bg-muted/30
        p-4
      "
    >
      <legend className="sr-only">
        {content.title}
      </legend>

      <div className="mb-4">
        <p className="font-medium text-foreground">
          {content.title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {content.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {LETTER_SPACING_OPTIONS.map((option) => {
          const isSelected =
            preferences.letterSpacing === option.value;

          return (
            <label
              key={option.value}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name="accessibility-letter-spacing"
                value={option.value}
                checked={isSelected}
                onChange={() => {
                  updatePreference(
                    "letterSpacing",
                    option.value,
                  );
                }}
                className="peer sr-only"
              />

              <span
                className="
                  flex min-h-10
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-xl
                  border border-border
                  bg-background
                  px-3 py-2
                  text-center
                  transition-colors

                  hover:bg-muted

                  peer-checked:border-foreground
                  peer-checked:bg-foreground
                  peer-checked:text-background

                  peer-focus-visible:outline-none
                  peer-focus-visible:ring-2
                  peer-focus-visible:ring-ring
                  peer-focus-visible:ring-offset-2
                "
              >
                <span
                  aria-hidden="true"
                  className="text-lg font-semibold"
                >
                  {LETTER_SPACING_PREVIEW[option.value]}
                </span>

                <span className="text-xs font-medium">
                  {content.options[option.labelKey]}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}