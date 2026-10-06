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

type AccessibilityPanelProps = {
  id: string
  title: string
  closeLabel: string
  resetLabel: string
  textSectionTitle: string
  textScaleContent: TextScaleControlContent
}

export function AccessibilityPanel({
  id,
  title,
  closeLabel,
  resetLabel,
  textSectionTitle,
  textScaleContent,
}: AccessibilityPanelProps) {
   const { resetPreferences } = useAccessibility();
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
      </div>
    </DrawerContent>
  )
}
