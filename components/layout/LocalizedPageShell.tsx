import type { ReactNode } from "react"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

import type { RouteKey, SiteLocale } from "@/lib/i18n/config"

type LocalizedPageShellProps = {
  locale: SiteLocale
  currentRoute: RouteKey
  children: ReactNode
}

export function LocalizedPageShell({
  locale,
  currentRoute,
  children,
}: LocalizedPageShellProps) {
  return (
    <>
      <Navbar locale={locale} currentRoute={currentRoute} />

      <main>{children}</main>
      
      <Footer locale={locale} currentRoute={currentRoute} />
    </>
  )
}
