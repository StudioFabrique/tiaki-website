import type { AccessibilityPreferences } from "./types";

function toggleDataAttribute(
  element: HTMLElement,
  name: string,
  enabled: boolean,
): void {
  if (enabled) {
    element.setAttribute(name, "");
  } else {
    element.removeAttribute(name);
  }
}

export function applyAccessibilityPreferences(
  preferences: AccessibilityPreferences,
): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  if (preferences.textScale === 1) {
    root.removeAttribute("data-a11y-text-scale");
  } else {
    root.setAttribute(
      "data-a11y-text-scale",
      String(preferences.textScale),
    );
  }

  if (preferences.lineSpacing === "default") {
    root.removeAttribute("data-a11y-line-spacing");
  } else {
    root.setAttribute(
      "data-a11y-line-spacing",
      preferences.lineSpacing,
    );
  }

  if (preferences.letterSpacing === "default") {
    root.removeAttribute("data-a11y-letter-spacing");
  } else {
    root.setAttribute(
      "data-a11y-letter-spacing",
      preferences.letterSpacing,
    );
  }

  toggleDataAttribute(
    root,
    "data-a11y-high-contrast",
    preferences.highContrast,
  );

  toggleDataAttribute(
    root,
    "data-a11y-grayscale",
    preferences.grayscale,
  );

  toggleDataAttribute(
    root,
    "data-a11y-underline-links",
    preferences.underlineLinks,
  );

  toggleDataAttribute(
    root,
    "data-a11y-enhanced-focus",
    preferences.enhancedFocus,
  );

  toggleDataAttribute(
    root,
    "data-a11y-reduce-motion",
    preferences.reduceMotion === "reduce",
  );

  toggleDataAttribute(
    root,
    "data-a11y-hide-decorative-images",
    preferences.hideDecorativeImages,
  );

  toggleDataAttribute(
    root,
    "data-a11y-reading-guide",
    preferences.readingGuide,
  );
}