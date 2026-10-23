"use client"

import { useEffect, useState } from "react"

import { useAccessibility } from "./AccessibilityProvider"
import { DEFAULT_ACCESSIBILITY_PREFERENCES } from "@/lib/accessibility/defaults"

import { AccessibilityPanel } from "./AccessibilityPanel"
import { AccessibilityTrigger } from "./AccessibilityTrigger"

import type {
  ChoiceSectionContent,
  VisibilitySectionContent,
} from "@/lib/accessibility/registry"

import { Drawer, DrawerTrigger } from "@/components/ui/drawer"

type AccessibilityWidgetContent = {
  trigger: {
    open: string
    close: string
    active: string
  }
  panel: {
    title: string
    description: string
    close: string
    reset: string

    sections: {
      textAndReading: ChoiceSectionContent<"textAndReading">
      visibility: VisibilitySectionContent
      motion: ChoiceSectionContent<"motion">
    }
  }
}

type AccessibilityWidgetProps = {
  content: AccessibilityWidgetContent
}

const ACCESSIBILITY_PANEL_ID = "accessibility-panel"

export function AccessibilityWidget({ content }: AccessibilityWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const { preferences } = useAccessibility()

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)")

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches)
    }

    updateViewport()

    mediaQuery.addEventListener("change", updateViewport)

    return () => {
      mediaQuery.removeEventListener("change", updateViewport)
    }
  }, [])

  const triggerLabel = isOpen ? content.trigger.close : content.trigger.open

  const hasActivePreferences = (
    Object.keys(DEFAULT_ACCESSIBILITY_PREFERENCES) as Array<
      keyof typeof DEFAULT_ACCESSIBILITY_PREFERENCES
    >
  ).some((key) => preferences[key] !== DEFAULT_ACCESSIBILITY_PREFERENCES[key])

    const accessibleTriggerLabel = hasActivePreferences
    ? `${triggerLabel} — ${content.trigger.active}`
    : triggerLabel

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      swipeDirection={isDesktop ? "right" : "down"}
    >
      <DrawerTrigger
        render={
          <AccessibilityTrigger
            label={accessibleTriggerLabel}
            hasActivePreferences={hasActivePreferences}
          />
        }
      />

      <AccessibilityPanel
        id={ACCESSIBILITY_PANEL_ID}
        title={content.panel.title}
        description={content.panel.description}
        closeLabel={content.panel.close}
        resetLabel={content.panel.reset}
        textAndReadingContent={content.panel.sections.textAndReading}
        visibilityContent={content.panel.sections.visibility}
        motionContent={content.panel.sections.motion}
      />
    </Drawer>
  )
}
