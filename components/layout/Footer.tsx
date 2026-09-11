import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { getFooterContent } from "@/lib/content/footer";
import { getNavigationContent } from "@/lib/content/navigation";
import {
  getLocalizedPath,
  type RouteKey,
  type SiteLocale,
} from "@/lib/i18n/config";

type FooterProps = {
  locale: SiteLocale;
  currentRoute: RouteKey;
};

const navigationRoutes: RouteKey[] = [
  "home",
  "platform",
  "about",
  "contact",
];

export function Footer({
  locale,
  currentRoute,
}: FooterProps) {
  const content = getFooterContent(locale);
  const navigation = getNavigationContent(locale);

  const otherLocale: SiteLocale =
    locale === "fr" ? "es" : "fr";

  const languageHref = getLocalizedPath(
    currentRoute,
    otherLocale
  );

  return (
    <footer className="pb-6 pt-8">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-neutral-950 text-white">
          {/* Main footer */}
          <div className="grid gap-12 p-7 sm:p-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:p-14">
            {/* Brand */}
            <div>
              <Link
                href={getLocalizedPath("home", locale)}
                className="inline-block"
                aria-label="T-IA-KI"
              >
                <div className="flex min-h-[86px] w-[210px] items-center rounded-[1.25rem] bg-white p-4">
                  <div className="relative h-[54px] w-full">
                    <Image
                      src="/images/logos/tiaki.png"
                      alt="T-IA-KI"
                      fill
                      sizes="210px"
                      className="object-contain object-left"
                    />
                  </div>
                </div>
              </Link>

              <p className="mt-7 max-w-md text-base leading-7 text-white/60">
                {content.description}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h2 className="font-heading text-sm font-semibold text-white/40">
                {content.navigationTitle}
              </h2>

              <nav className="mt-6 flex flex-col items-start gap-4">
                {navigationRoutes.map((route) => (
                  <Link
                    key={route}
                    href={getLocalizedPath(
                      route,
                      locale
                    )}
                    className="font-heading text-base font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {navigation[route]}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Project */}
            <div>
              <h2 className="font-heading text-sm font-semibold text-white/40">
                {content.projectTitle}
              </h2>

              <div className="mt-6 flex flex-col items-start gap-4">
                <Link
                  href={getLocalizedPath(
                    "platform",
                    locale
                  )}
                  className="font-heading text-base font-medium text-white/75 transition-colors hover:text-white"
                >
                  {content.projectLinks.platform}
                </Link>

                <Link
                  href={getLocalizedPath(
                    "about",
                    locale
                  )}
                  className="font-heading text-base font-medium text-white/75 transition-colors hover:text-white"
                >
                  {content.projectLinks.about}
                </Link>

                <Link
                  href={getLocalizedPath(
                    "contact",
                    locale
                  )}
                  className="font-heading text-base font-medium text-white/75 transition-colors hover:text-white"
                >
                  {content.projectLinks.contact}
                </Link>
              </div>
            </div>
          </div>

          {/* European funding */}
          <div className="border-t border-white/10 p-7 sm:p-10 lg:p-14">
            <div className="grid items-center gap-8 rounded-[1.5rem] bg-white p-6 text-neutral-950 sm:p-8 lg:grid-cols-[280px_1fr]">
              <div className="relative h-[100px] w-full">
                <Image
                  src="/images/logos/poctefa.png"
                  alt={content.fundingAlt}
                  fill
                  sizes="280px"
                  className="object-contain object-left"
                />
              </div>

              <p className="max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
                {content.funding}
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 px-7 py-6 sm:px-10 lg:px-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/40">
                © {new Date().getFullYear()}{" "}
                {content.copyright}
              </p>

              <div className="flex items-center gap-3">
                <span className="font-heading text-sm font-semibold text-white">
                  {locale.toUpperCase()}
                </span>

                <span className="text-white/25">
                  /
                </span>

                <Link
                  href={languageHref}
                  className="font-heading text-sm font-semibold text-white/45 transition-colors hover:text-white"
                >
                  {otherLocale.toUpperCase()}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}