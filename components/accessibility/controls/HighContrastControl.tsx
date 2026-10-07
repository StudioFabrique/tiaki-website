"use client";

import { useAccessibility } from "../AccessibilityProvider";

export type HighContrastControlContent = {
  title: string;
  description: string;
};

type HighContrastControlProps = {
  content: HighContrastControlContent;
};

export function HighContrastControl({
  content,
}: HighContrastControlProps) {
  const {
    preferences,
    updatePreference,
  } = useAccessibility();

  const isEnabled = preferences.highContrast;

  return (
    <label
      className="
        flex cursor-pointer
        items-center justify-between
        gap-4
        rounded-2xl
        border border-border
        bg-muted/30
        p-4
        transition-colors
        hover:bg-muted/50
      "
    >
      <span className="min-w-0">
        <span className="block font-medium text-foreground">
          {content.title}
        </span>

        <span className="mt-1 block text-sm text-muted-foreground">
          {content.description}
        </span>
      </span>

      <span className="relative shrink-0">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(event) => {
            updatePreference(
              "highContrast",
              event.target.checked,
            );
          }}
          className="peer sr-only"
        />

        <span
          aria-hidden="true"
          className="
            block h-7 w-12
            rounded-full
            border border-border
            bg-background
            transition-colors

            peer-checked:border-foreground
            peer-checked:bg-foreground

            peer-focus-visible:outline-none
            peer-focus-visible:ring-2
            peer-focus-visible:ring-ring
            peer-focus-visible:ring-offset-2

            after:absolute
            after:left-1
            after:top-1
            after:size-5
            after:rounded-full
            after:bg-foreground
            after:transition-transform

            peer-checked:after:translate-x-5
            peer-checked:after:bg-background
          "
        />
      </span>
    </label>
  );
}