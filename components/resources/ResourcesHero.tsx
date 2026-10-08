import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { getResourcesUI } from "@/lib/content/resources";
import type { SiteLocale } from "@/lib/i18n/config";

type ResourcesHeroProps = {
  locale: SiteLocale;
};

export function ResourcesHero({
  locale,
}: ResourcesHeroProps) {
  const content = getResourcesUI(locale);

  return (
    <section className="pt-4 sm:pt-6">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-tiaki-blue/30">
          <div className="grid min-h-[320px] lg:grid-cols-[1.1fr_0.9fr]">
            {/* Text */}
            <div className="flex min-w-0 items-center p-7 sm:p-10 lg:p-14">
              <div className="min-w-0 max-w-3xl">
                <h1 className="max-w-full break-normal font-heading text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
                  {content.hero.title}
                </h1>

                <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  {content.hero.description}
                </p>
              </div>
            </div>

            {/* Picto */}
            <div className="flex min-h-[30px] items-center justify-center px-8 pb-8 sm:min-h-[30px] sm:px-10 lg:min-h-0 lg:p-12">
              <div className="relative h-[200px] w-full sm:h-[200px] lg:h-[240px]">
                <Image
                data-a11y-grayscale-image
                  src="/images/pictos/picto-2.png"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
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