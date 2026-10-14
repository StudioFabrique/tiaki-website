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

import { ChoicePreferenceControl } from "@/components/accessibility/controls/ChoicePreferenceControl"

// Boolean Preferences
import { BooleanPreferenceControl } from "@/components/accessibility/controls/BooleanPreferenceControl"

import {
  VISIBILITY_CONTROLS,
  CHOICE_CONTROLS,
  CHOICE_CONTROL_SECTIONS,
  type VisibilitySectionContent,
  type ChoiceControlContent,
  type ChoiceControlKey,
  type ChoiceSectionContent,
} from "@/lib/accessibility/registry"

type AccessibilityPanelProps = {
  id: string

  title: string
  description: string

  closeLabel: string
  resetLabel: string

  textAndReadingContent: ChoiceSectionContent<"textAndReading">
  motionContent: ChoiceSectionContent<"motion">

  visibilityContent: VisibilitySectionContent

  accessibilityStatementLabel?: string
  accessibilityStatementHref?: string
}

export function AccessibilityPanel({
  id,
  title,
  description,
  closeLabel,
  resetLabel,

  textAndReadingContent,
  visibilityContent,
  motionContent,

  accessibilityStatementLabel,
  accessibilityStatementHref,
}: AccessibilityPanelProps) {
  const { preferences, updatePreference, resetPreferences } = useAccessibility()

  const choiceContent = {
    textScale: textAndReadingContent.textScale,
    lineSpacing: textAndReadingContent.lineSpacing,
    letterSpacing: textAndReadingContent.letterSpacing,
    reduceMotion: motionContent.reduceMotion,
  } satisfies {
    [K in ChoiceControlKey]: ChoiceControlContent<K>
  }

  const renderChoiceControl = (preference: ChoiceControlKey) => {
    const config = CHOICE_CONTROLS[preference]

    return (
      <ChoicePreferenceControl<string | number, string>
        key={preference}
        name={config.name}
        content={choiceContent[preference]}
        options={config.options}
        value={preferences[preference]}
        onChange={(value) => {
          const selectedOption = config.options.find(
            (option) => option.value === value
          )

          if (selectedOption) {
            updatePreference(preference, selectedOption.value)
          }
        }}
        density={"density" in config ? config.density : undefined}
      />
    )
  }

  return (
    <DrawerContent
      id={id}
      className="overflow-clip rounded-xl border [--drawer-height:75dvh] [--drawer-inset:8px] after:hidden sm:[--drawer-content-width:24rem] sm:[--drawer-height:auto] sm:[--drawer-inset:24px]"
    >
      {/* ========HEADER=============================== */}

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
              {textAndReadingContent.title}
            </h3>

            <div className="space-y-3">
              {CHOICE_CONTROL_SECTIONS.textAndReading.map(renderChoiceControl)}
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
              {visibilityContent.title}
            </h3>

            <div className="space-y-3">
              {VISIBILITY_CONTROLS.map((preference) => (
                <BooleanPreferenceControl
                  key={preference}
                  preference={preference}
                  content={visibilityContent[preference]}
                />
              ))}
            </div>
          </section>

          {/* =========================================
              MOUVEMENT ET CONFORT
              ========================================= */}

          <section aria-labelledby={`${id}-motion-title`} className="space-y-4">
            <h3
              id={`${id}-motion-title`}
              className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase"
            >
              {motionContent.title}
            </h3>

            <div className="space-y-3">
              {CHOICE_CONTROL_SECTIONS.motion.map(renderChoiceControl)}
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
