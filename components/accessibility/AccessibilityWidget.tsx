"use client"

import { useEffect, useState } from "react"

import { AccessibilityPanel } from "./AccessibilityPanel"
import { AccessibilityTrigger } from "./AccessibilityTrigger"

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
      textAndReading: {
        title: string

        // TextResizing
        textScale: {
          title: string
          description: string
          options: {
            smaller: string
            default: string
            large: string
            larger: string
          }
        }
        // lineSpacing
        lineSpacing: {
          title: string
          description: string
          options: {
            default: string
            relaxed: string
            wide: string
          }
        }
        // Letter Spacing
        letterSpacing: {
          title: string
          description: string
          options: {
            default: string
            wide: string
          }
        }
      }

      visibility: {
        title: string

        highContrast: {
          title: string
          description: string
        }

        grayscale: {
          title: string
          description: string
        }

        underlineLinks: {
          title: string
          description: string
        }
        enhancedFocus: {
          title: string
          description: string
        }
      }
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
        textSectionTitle={content.panel.sections.textAndReading.title}
        textScaleContent={content.panel.sections.textAndReading.textScale}
        lineSpacingContent={content.panel.sections.textAndReading.lineSpacing}
        letterSpacingContent={
          content.panel.sections.textAndReading.letterSpacing
        }
        visibilitySectionTitle={content.panel.sections.visibility.title}
        highContrastContent={content.panel.sections.visibility.highContrast}
        grayscaleContent={content.panel.sections.visibility.grayscale}
        underlineLinksContent={content.panel.sections.visibility.underlineLinks}
        enhancedFocusContent={content.panel.sections.visibility.enhancedFocus}
      />
    </Drawer>
  )
}
