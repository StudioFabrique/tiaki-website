"use client"

import { LINE_SPACING_OPTIONS } from "@/lib/accessibility/defaults"
import type { LineSpacing } from "@/lib/accessibility/types"

import { useAccessibility } from "../AccessibilityProvider"

type LineSpacingLabelKey = (typeof LINE_SPACING_OPTIONS)[number]["labelKey"]

export type LineSpacingControlContent = {
  title: string
  description: string
  options: Record<LineSpacingLabelKey, string>
}

type LineSpacingControlProps = {
  content: LineSpacingControlContent
}

const LINE_SPACING_PREVIEW: Record<LineSpacing, string> = {
  default: "≡",
  relaxed: "☰",
  wide: "↕",
}

export function LineSpacingControl({ content }: LineSpacingControlProps) {
  const { preferences, updatePreference } = useAccessibility()

  return (
    <fieldset className="rounded-2xl border border-border bg-muted/30 p-4">
      <legend className="sr-only">{content.title}</legend>

      <div className="mb-4">
        <p className="font-medium text-foreground">{content.title}</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {content.description}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {LINE_SPACING_OPTIONS.map((option) => {
          const isSelected = preferences.lineSpacing === option.value

          return (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="accessibility-line-spacing"
                value={option.value}
                checked={isSelected}
                onChange={() => {
                  updatePreference("lineSpacing", option.value)
                }}
                className="peer sr-only"
              />

              <span className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-background px-2 py-3 text-center transition-colors peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:outline-none hover:bg-muted">
                <span aria-hidden="true" className="text-lg font-semibold">
                  {LINE_SPACING_PREVIEW[option.value]}
                </span>

                <span className="text-xs font-medium">
                  {content.options[option.labelKey]}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
