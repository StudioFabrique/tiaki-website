"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { Accessibility } from "lucide-react"

type AccessibilityTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  hasActivePreferences?: boolean
}

export const AccessibilityTrigger = forwardRef<
  HTMLButtonElement,
  AccessibilityTriggerProps
>(function AccessibilityTrigger(
  { label, hasActivePreferences = false, className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      data-a11y-preferences-active={hasActivePreferences ? "" : undefined}
      className={`fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${
        hasActivePreferences
          ? [
              "border-[var(--tiaki-green-700)]",
              "bg-[var(--tiaki-green-100)]",
              "text-[var(--tiaki-green-900)]",
              "hover:bg-[var(--tiaki-green-300)]",
            ].join(" ")
          : "border-border bg-background text-foreground hover:bg-muted"
      } ${className}`}
      {...props}
    >
      <Accessibility aria-hidden="true" className="size-6" strokeWidth={2} />

      {hasActivePreferences && (
        <span
          data-a11y-status-dot
          aria-hidden="true"
          className="pointer-events-none absolute -top-1 -right-1 size-3.5 rounded-full border-2 border-background bg-[var(--tiaki-green-700)]"
        />
      )}
    </button>
  )
})
