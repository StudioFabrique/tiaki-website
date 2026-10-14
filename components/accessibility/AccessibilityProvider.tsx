"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import { applyAccessibilityPreferences } from "@/lib/accessibility/apply"
import { DEFAULT_ACCESSIBILITY_PREFERENCES } from "@/lib/accessibility/defaults"
import { getInitialAccessibilityPreferences } from "@/lib/accessibility/initial"
import { writeAccessibilityPreferences } from "@/lib/accessibility/storage"

import type { AccessibilityPreferences } from "@/lib/accessibility/types"

type AccessibilityContextValue = {
  preferences: AccessibilityPreferences

  updatePreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => void

  resetPreferences: () => void
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null
)

type AccessibilityProviderProps = {
  children: ReactNode
}

const subscribe = () => () => {}

const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const hydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )

  const initialPreferences = useMemo(
    () =>
      hydrated
        ? getInitialAccessibilityPreferences()
        : DEFAULT_ACCESSIBILITY_PREFERENCES,
    [hydrated]
  )

  const [updatedPreferences, setUpdatedPreferences] =
    useState<AccessibilityPreferences | null>(null)

  const preferences =
    updatedPreferences ?? initialPreferences

  useEffect(() => {
    if (!hydrated) return

   
    applyAccessibilityPreferences(preferences)
    // Persist only user-initiated changes.
    if (updatedPreferences !== null) {
      writeAccessibilityPreferences(preferences)
    }
  }, [hydrated, preferences, updatedPreferences])

  const updatePreference = useCallback(
    <K extends keyof AccessibilityPreferences>(
      key: K,
      value: AccessibilityPreferences[K]
    ) => {
      setUpdatedPreferences((current) => ({
        ...(current ?? initialPreferences),
        [key]: value,
      }))
    },
    [initialPreferences]
  )

  const resetPreferences = useCallback(() => {
    setUpdatedPreferences({
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
    })
  }, [])

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
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)

  if (!context) {
    throw new Error(
      "useAccessibility must be used inside AccessibilityProvider"
    )
  }

  return context
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
