import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { getComingSoonContent } from "@/lib/content/cooming-soon";
import { getNavigationContent } from "@/lib/content/navigation";
import {
  getLocalizedPath,
  type RouteKey,
  type SiteLocale,
} from "@/lib/i18n/config";

type ComingSoonPageProps = {
  locale: SiteLocale;
  route: RouteKey;
};

export function ComingSoonPage({
  locale,
  route,
}: ComingSoonPageProps) {
  const content = getComingSoonContent(locale);
  const navigation = getNavigationContent(locale);

  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-tiaki-blue/25">
          <div className="grid min-h-[620px] lg:grid-cols-[1.05fr_0.95fr]">
            {/* Content */}
            <div className="order-2 flex items-center p-7 sm:p-10 lg:order-1 lg:p-14">
              <div className="max-w-3xl">
                <p className="font-heading text-sm font-semibold uppercase tracking-[0.12em] text-foreground/40">
                  {navigation[route]}
                </p>

                <h1 className="mt-5 font-heading text-5xl font-bold leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  {content.title}
                </h1>

                <p className="mt-7 text-lg leading-8 text-foreground/65">
                  {content.description}
                </p>

                <p className="mt-4 text-base leading-7 text-foreground/50">
                  {content.secondary}
                </p>

                <div className="mt-9">
                  <Link
                    href={getLocalizedPath("home", locale)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 font-heading text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <ArrowLeft className="size-4" />
                    {content.backHome}
                  </Link>
                </div>
              </div>
            </div>

            {/* Picto */}
            <div className="order-1 flex min-h-[340px] items-center justify-center p-8 sm:min-h-[400px] sm:p-10 lg:order-2 lg:min-h-0 lg:p-14">
              <div className="relative h-[300px] w-full sm:h-[340px] lg:h-[420px]">
                <Image
                  src="/images/pictos/picto-5.png"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}