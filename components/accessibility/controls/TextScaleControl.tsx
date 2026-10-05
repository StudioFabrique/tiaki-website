"use client";

import { TEXT_SCALE_OPTIONS } from "@/lib/accessibility/defaults";
import type { TextScale } from "@/lib/accessibility/types";

import { useAccessibility } from "../AccessibilityProvider";

type TextScaleLabelKey =
  (typeof TEXT_SCALE_OPTIONS)[number]["labelKey"];

export type TextScaleControlContent = {
  title: string;
  description: string;
  options: Record<TextScaleLabelKey, string>;
};

type TextScaleControlProps = {
  content: TextScaleControlContent;
};

const TEXT_SCALE_PREVIEW: Record<TextScale, string> = {
  0.9: "A−",
  1: "A",
  1.125: "A+",
  1.25: "A++",
};

export function TextScaleControl({
  content,
}: TextScaleControlProps) {
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

      <div className="grid grid-cols-4 gap-2">
        {TEXT_SCALE_OPTIONS.map((option) => {
          const isSelected =
            preferences.textScale === option.value;

          return (
            <label
              key={option.value}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name="accessibility-text-scale"
                value={option.value}
                checked={isSelected}
                onChange={() => {
                  updatePreference(
                    "textScale",
                    option.value,
                  );
                }}
                className="peer sr-only"
              />

              <span
                className="
                  flex min-h-20
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-xl
                  border border-border
                  bg-background
                  px-2 py-3
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
                  {TEXT_SCALE_PREVIEW[option.value]}
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