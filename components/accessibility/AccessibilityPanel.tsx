"use client"

import Link from "next/link"
import { RotateCcw } from "lucide-react"

import {
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { useAccessibility } from "./AccessibilityProvider"

// TextScale
import {
  TextScaleControl,
  type TextScaleControlContent,
} from "@/components/accessibility/controls/TextScaleControl"

// LineSpacing
import {
  LineSpacingControl,
  type LineSpacingControlContent,
} from "@/components/accessibility/controls/LineSpacingControl"

// LetterSpacing
import {
  LetterSpacingControl,
  type LetterSpacingControlContent,
} from "@/components/accessibility/controls/LetterSpacingControl"

// HighContrast
import {
  HighContrastControl,
  type HighContrastControlContent,
} from "@/components/accessibility/controls/HighContrastControl"
// Graysacale
import {
  GrayscaleControl,
  type GrayscaleControlContent,
} from "@/components/accessibility/controls/GrayscaleControl"

// Underline links
import {
  UnderlineLinksControl,
  type UnderlineLinksControlContent,
} from "@/components/accessibility/controls/UnderlineLinksControl"

type AccessibilityPanelProps = {
  id: string

  title: string
  description: string

  closeLabel: string
  resetLabel: string

  textSectionTitle: string
  visibilitySectionTitle: string

  textScaleContent: TextScaleControlContent
  lineSpacingContent: LineSpacingControlContent
  letterSpacingContent: LetterSpacingControlContent
  highContrastContent: HighContrastControlContent
  underlineLinksContent: UnderlineLinksControlContent

  grayscaleContent: GrayscaleControlContent

  accessibilityStatementLabel?: string
  accessibilityStatementHref?: string
}

export function AccessibilityPanel({
  id,
  title,
  description,
  closeLabel,
  resetLabel,
  textSectionTitle,
  visibilitySectionTitle,
  textScaleContent,
  lineSpacingContent,
  letterSpacingContent,
  highContrastContent,
  grayscaleContent,
  underlineLinksContent,
  accessibilityStatementLabel,
  accessibilityStatementHref,
}: AccessibilityPanelProps) {
  const { resetPreferences } = useAccessibility()

  return (
    <DrawerContent
      id={id}
      className="overflow-hidden rounded-xl border [--drawer-height:75dvh] [--drawer-inset:8px] after:hidden sm:[--drawer-content-width:24rem] sm:[--drawer-height:auto] sm:[--drawer-inset:24px]"
    >
      {/* =====================================================
          HEADER
         ===================================================== */}

      <DrawerHeader className="shrink-0 border-b border-border p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <DrawerTitle className="font-heading text-lg font-semibold text-foreground">
              {title}
            </DrawerTitle>

            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          <DrawerClose
            render={
              <button
                type="button"
                aria-label={closeLabel}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border text-lg text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <span aria-hidden="true">×</span>
              </button>
            }
          />
        </div>
      </DrawerHeader>

      {/* =====================================================
          SCROLLABLE CONTENT
         ===================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-8 p-4 sm:p-5">
          {/* =================================================
              TEXTE ET LECTURE
             ================================================= */}

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

            <div className="space-y-3">
              <TextScaleControl content={textScaleContent} />
              <LineSpacingControl content={lineSpacingContent} />
              <LetterSpacingControl content={letterSpacingContent} />
            </div>
          </section>

          {/* =================================================
              VISIBILITÉ
             ================================================= */}

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

            <div className="space-y-3">
              <HighContrastControl content={highContrastContent} />
              <GrayscaleControl content={grayscaleContent} />
              <UnderlineLinksControl content={underlineLinksContent} />
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================
          FOOTER
         ===================================================== */}

      <div className="shrink-0 border-t border-border bg-background p-4 sm:p-5">
        <div className="space-y-2">
          <button
            type="button"
            onClick={resetPreferences}
            className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-left font-heading text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <RotateCcw aria-hidden="true" className="size-4 shrink-0" />

            <span>{resetLabel}</span>
          </button>

          {accessibilityStatementLabel && accessibilityStatementHref && (
            <Link
              href={accessibilityStatementHref}
              className="flex min-h-10 items-center rounded-xl px-4 font-heading text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {accessibilityStatementLabel}
            </Link>
          )}
        </div>
      </div>
    </DrawerContent>
  )
}
