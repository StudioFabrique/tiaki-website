"use client"

import { useAccessibility } from "../AccessibilityProvider"
import type { MotionPreference } from "@/lib/accessibility/types"

export type ReduceMotionControlContent = {
  title: string
  description: string
  options: {
    system: string
    reduce: string
  }
}

type ReduceMotionControlProps = {
  content: ReduceMotionControlContent
}

const MOTION_OPTIONS: MotionPreference[] = ["system", "reduce"]

export function ReduceMotionControl({ content }: ReduceMotionControlProps) {
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

      <div className="grid grid-cols-2 gap-2">
        {MOTION_OPTIONS.map((option) => {
          const isSelected = preferences.reduceMotion === option

          return (
            <label key={option} className="relative block cursor-pointer">
              <input
                type="radio"
                name="accessibility-reduce-motion"
                value={option}
                checked={isSelected}
                onChange={() => updatePreference("reduceMotion", option)}
                className="peer sr-only top-1/2 left-1/2"
              />

              <span className="flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-3 py-3 text-center text-sm font-medium transition-colors 
              
              peer-checked:border-foreground 
              peer-checked:bg-foreground 
              peer-checked:text-background 
              peer-focus-visible:ring-2 
              peer-focus-visible:ring-ring 
              peer-focus-visible:ring-offset-2 
              peer-focus-visible:outline-none 
              
              hover:bg-muted peer-checked:hover:bg-foreground peer-checked:hover:text-background">
                {content.options[option]}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
