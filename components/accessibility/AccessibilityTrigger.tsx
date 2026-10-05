"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

type AccessibilityTriggerProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
  };

export const AccessibilityTrigger = forwardRef<
  HTMLButtonElement,
  AccessibilityTriggerProps
>(function AccessibilityTrigger(
  {
    label,
    className = "",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={`
        fixed bottom-6 right-6 z-50
        flex h-12 w-12
        items-center justify-center
        rounded-full
        border border-border
        bg-background
        text-foreground
        shadow-lg
        transition
        hover:bg-muted
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        ${className}
      `}
      {...props}
    >
      <span
        aria-hidden="true"
        className="text-sm font-bold"
      >
        Aa
      </span>
    </button>
  );
});