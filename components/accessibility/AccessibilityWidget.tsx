"use client"

import { useEffect, useState } from "react"

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

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      swipeDirection={isDesktop ? "right" : "down"}
    >
      <DrawerTrigger render={<AccessibilityTrigger label={triggerLabel} />} />

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
