import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { getHomeContent } from "@/lib/content/home";
import {
  getLocalizedPath,
  type SiteLocale,
} from "@/lib/i18n/config";

type HomeFinalCtaProps = {
  locale: SiteLocale;
};

export function HomeFinalCta({
  locale,
}: HomeFinalCtaProps) {
  const { finalCta } = getHomeContent(locale);

  return (
    <section className="py-2 sm:py-8 lg:py-12">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-tiaki-blue">
          <div className="grid min-h-[520px] lg:grid-cols-[1.05fr_0.95fr]">
            {/* Content */}
            <div className="order-2 flex items-center p-7 sm:p-10 lg:order-1 lg:p-14">
              <div>
                <h2 className="font-heading text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
                  {finalCta.title}
                </h2>

                <p className="mt-6 text-base leading-7 text-foreground/70 sm:text-lg sm:leading-8">
                  {finalCta.description}
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={getLocalizedPath(
                      "platform",
                      locale
                    )}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 font-heading text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    {finalCta.primaryCta}

                    <ArrowRight className="size-4" />
                  </Link>

                  <Link
                    href={getLocalizedPath(
                      "contact",
                      locale
                    )}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/25 px-7 font-heading text-sm font-semibold text-foreground transition-colors hover:bg-foreground/10"
                  >
                    {finalCta.secondaryCta}
                  </Link>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="order-1 flex min-h-[340px] items-center justify-center p-8 sm:min-h-[400px] sm:p-10 lg:order-2 lg:min-h-0 lg:p-14">
              <div className="relative h-[280px] w-full sm:h-[320px] lg:h-[380px]">
                <Image
                  src="/images/pictos/picto-10-orange.png"
                  alt=""
                  fill
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