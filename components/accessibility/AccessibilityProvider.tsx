"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { applyAccessibilityPreferences } from "@/lib/accessibility/apply";
import { DEFAULT_ACCESSIBILITY_PREFERENCES } from "@/lib/accessibility/defaults";
import { getInitialAccessibilityPreferences } from "@/lib/accessibility/initial";
import {
  removeAccessibilityPreferences,
  writeAccessibilityPreferences,
} from "@/lib/accessibility/storage";

import type { AccessibilityPreferences } from "@/lib/accessibility/types";

type AccessibilityContextValue = {
  preferences: AccessibilityPreferences;

  updatePreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K],
  ) => void;

  resetPreferences: () => void;
};

const AccessibilityContext =
  createContext<AccessibilityContextValue | null>(null);

type AccessibilityProviderProps = {
  children: ReactNode;
};

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [preferences, setPreferences] =
    useState<AccessibilityPreferences>(
      DEFAULT_ACCESSIBILITY_PREFERENCES,
    );

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialPreferences = getInitialAccessibilityPreferences();

    setPreferences(initialPreferences);
    applyAccessibilityPreferences(initialPreferences);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    applyAccessibilityPreferences(preferences);
    writeAccessibilityPreferences(preferences);
  }, [preferences, initialized]);

  const updatePreference = useCallback(
    <K extends keyof AccessibilityPreferences>(
      key: K,
      value: AccessibilityPreferences[K],
    ) => {
      setPreferences((current) => ({
        ...current,
        [key]: value,
      }));
    },
    [],
  );

  const resetPreferences = useCallback(() => {
    setPreferences({
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
    });

    removeAccessibilityPreferences();
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        updatePreference,
        resetPreferences,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility must be used inside AccessibilityProvider",
    );
  }

  return context;
}


// //

//                         ┌─────────────────┐
//                         │   localStorage  │
//                         └────────┬────────┘
//                                  │
//                               storage.ts
//                                  │
//                               initial.ts
//                                  │
//                           preferences.ts
//                                  │
//                                  ▼
//                  ┌──────────────────────────┐
//                  │ AccessibilityProvider    │
//                  │                          │
//                  │ preferences              │
//                  │ updatePreference()       │
//                  │ resetPreferences()       │
//                  └─────────────┬────────────┘
//                                │
//                     ┌──────────┴──────────┐
//                     │                     │
//                     ▼                     ▼
//                  apply.ts          localStorage
//                     │
//                     ▼
//              <html data-a11y-*>
//                     │
//                     ▼
//               CSS global