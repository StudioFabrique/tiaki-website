
"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LocalizedPageShell } from "@/components/layout/LocalizedPageShell";

import {
  getRouteKeyFromSlug,
  type RouteKey,
  type SiteLocale,
} from "@/lib/i18n/config";

type RouteAwareLocalizedShellProps = {
  locale: SiteLocale;
  children: ReactNode;
};

export function RouteAwareLocalizedShell({
  locale,
  children,
}: RouteAwareLocalizedShellProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const slug =
    segments[0] === locale
      ? segments[1]
      : undefined;

  const currentRoute: RouteKey = slug
    ? getRouteKeyFromSlug(locale, slug) ?? "home"
    : "home";

  return (
    <LocalizedPageShell
      locale={locale}
      currentRoute={currentRoute}
    >
      {children}
    </LocalizedPageShell>
  );
}
