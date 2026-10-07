"use client"

import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { RotateCcw } from "lucide-react"
import { useAccessibility } from "./AccessibilityProvider"

import {
  TextScaleControl,
  type TextScaleControlContent,
} from "@/components/accessibility/controls/TextScaleControl"
import {
  LineSpacingControl,
  type LineSpacingControlContent,
} from "@/components/accessibility/controls/LineSpacingControl"
import {
  LetterSpacingControl,
  type LetterSpacingControlContent,
} from "@/components/accessibility/controls/LetterSpacingControl"
import {
  HighContrastControl,
  type HighContrastControlContent,
} from "@/components/accessibility/controls/HighContrastControl"

type AccessibilityPanelProps = {
  id: string
  title: string
  closeLabel: string
  resetLabel: string
  textSectionTitle: string

  textScaleContent: TextScaleControlContent

  lineSpacingContent: LineSpacingControlContent
  letterSpacingContent: LetterSpacingControlContent

  visibilitySectionTitle: string
  highContrastContent: HighContrastControlContent
}

export function AccessibilityPanel({
  id,
  title,
  closeLabel,
  resetLabel,
  textSectionTitle,
  textScaleContent,
  lineSpacingContent,
  letterSpacingContent,
  visibilitySectionTitle,
  highContrastContent,
}: AccessibilityPanelProps) {
  const { resetPreferences } = useAccessibility()
  return (
    <DrawerContent
      id={id}
      className="rounded-xl border [--drawer-height:75dvh] [--drawer-inset:8px] after:hidden sm:[--drawer-content-width:24rem] sm:[--drawer-height:auto] sm:[--drawer-inset:24px]"
    >
      <DrawerHeader className="flex-row items-center justify-between gap-4">
        <DrawerTitle>{title}</DrawerTitle>

        <DrawerClose
          render={
            <button
              type="button"
              aria-label={closeLabel}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border text-lg hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span aria-hidden="true">×</span>
            </button>
          }
        />
      </DrawerHeader>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <section
          aria-labelledby={`${id}-text-reading-title`}
          className="space-y-3"
        >
          <h3
            id={`${id}-text-reading-title`}
            className="px-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          >
            {textSectionTitle}
          </h3>

          <TextScaleControl content={textScaleContent} />
          <LineSpacingControl content={lineSpacingContent} />
          <LetterSpacingControl content={letterSpacingContent} />

          {/* Accessibility ResetButton  */}
          <div className="shrink-0 border-t border-border p-4">
            <button
              type="button"
              onClick={resetPreferences}
              className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-left font-heading text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <RotateCcw aria-hidden="true" className="size-4 shrink-0" />

              <span>{resetLabel}</span>
            </button>
          </div>
        </section>
        <section
          aria-labelledby={`${id}-visibility-title`}
          className="space-y-3"
        >
          <h3
            id={`${id}-visibility-title`}
            className="px-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          >
            {visibilitySectionTitle}
          </h3>

          <HighContrastControl content={highContrastContent} />
        </section>
      </div>
    </DrawerContent>
  )
}
