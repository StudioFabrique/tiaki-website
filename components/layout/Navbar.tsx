import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getNavigationContent } from "@/lib/content/navigation"
import {
  getLocalizedPath,
  type RouteKey,
  type SiteLocale,
} from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

type NavbarProps = {
  locale: SiteLocale
  currentRoute: RouteKey
}

const navigationRoutes: RouteKey[] = [
  "home",
  "platform",
  "resources",
  "about",
  "contact",
]
const navigationLocales: SiteLocale[] = [
  "fr",
  "es",
];

export function Navbar({ locale, currentRoute }: NavbarProps) {
  const content = getNavigationContent(locale)

  const otherLocale: SiteLocale = locale === "fr" ? "es" : "fr"

  const languageHref = getLocalizedPath(currentRoute, otherLocale)

  return (
    <header className="border-b bg-background">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href={getLocalizedPath("home", locale)}
            className="relative block h-12 w-[150px] shrink-0"
            aria-label="T-IA-KI"
          >
            <Image
              src="/images/logos/tiaki.png"
              alt="T-IA-KI"
              fill
              priority
              sizes="150px"
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navigationRoutes.map((route) => {
              const isActive = currentRoute === route

              return (
                <Link
                  key={route}
                  href={getLocalizedPath(route, locale)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "font-heading text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {content[route]}
                </Link>
              )
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href={languageHref}
              className="font-heading text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {otherLocale.toUpperCase()}
            </Link>

            <Button className="font-heading">{content.appCta}</Button>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label={content.openMenu}
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[88vw] max-w-sm flex-col border-l-0 bg-background p-0 shadow-2xl"
            >
              {/* Header */}
              <SheetHeader className="border-b px-6 py-6 text-left">
                <SheetTitle className="sr-only">T-IA-KI</SheetTitle>

                <Link
                  href={getLocalizedPath("home", locale)}
                  className="relative block h-12 w-[160px]"
                  aria-label="T-IA-KI"
                >
                  <Image
                    src="/images/logos/tiaki.png"
                    alt="T-IA-KI"
                    fill
                    sizes="160px"
                    className="object-contain object-left"
                  />
                </Link>
              </SheetHeader>

              {/* Navigation */}
              <div className="flex min-h-0 flex-1 flex-col">
                <nav className="flex flex-col gap-2 px-4 py-6">
                  {navigationRoutes.map((route, index) => {
                    const isActive = currentRoute === route

                    return (
                      <Link
                        key={route}
                        href={getLocalizedPath(route, locale)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-14 items-center justify-between rounded-2xl px-4 py-3 font-heading text-lg font-semibold transition-colors",
                          isActive
                            ? "bg-tiaki-blue/30 text-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <span>{content[route]}</span>

                        <span
                          aria-hidden="true"
                          className={cn(
                            "font-heading text-xs font-semibold",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Bottom area */}
                <div className="mt-auto border-t p-4">
                  {/* Language */}
                  <div className="mb-4 flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
                    <span className="font-heading text-sm font-medium text-muted-foreground">
                      {locale === "fr" ? "Langue" : "Idioma"}
                    </span>
                    {/* Change langauges - active language - other language */}

                    <div className="flex items-center gap-2">
                      {navigationLocales.map((itemLocale, index) => {
                        const isActive = locale === itemLocale

                        return (
                          <div
                            key={itemLocale}
                            className="flex items-center gap-2"
                          >
                            {isActive ? (
                              <span
                                aria-current="true"
                                className="flex h-9 min-w-10 items-center justify-center rounded-full bg-foreground px-3 font-heading text-xs font-semibold text-background"
                              >
                                {itemLocale.toUpperCase()}
                              </span>
                            ) : (
                              <Link
                                href={getLocalizedPath(
                                  currentRoute,
                                  itemLocale
                                )}
                                className="flex h-9 min-w-10 items-center justify-center rounded-full px-3 font-heading text-xs font-semibold text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                              >
                                {itemLocale.toUpperCase()}
                              </Link>
                            )}

                            {index < navigationLocales.length - 1 && (
                              <span
                                aria-hidden="true"
                                className="text-muted-foreground"
                              >
                                /
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button className="h-12 w-full rounded-full font-heading text-sm font-semibold">
                    {content.appCta}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}
