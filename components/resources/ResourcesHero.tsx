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
        <div className="overflow-hidden rounded-[2rem] bg-tiaki-blue/20">
          <div className="grid min-h-[440px] lg:grid-cols-[1.1fr_0.9fr]">
            {/* Text */}
            <div className="flex items-center p-7 sm:p-10 lg:p-14">
              <div className="max-w-3xl">
                <h1 className="font-heading text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  {content.hero.title}
                </h1>

                <p className="mt-6 text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
                  {content.hero.description}
                </p>
              </div>
            </div>

            {/* Picto */}
            <div className="flex min-h-[300px] items-center justify-center px-8 pb-8 sm:min-h-[340px] sm:px-10 lg:min-h-0 lg:p-12">
              <div className="relative h-[280px] w-full sm:h-[320px] lg:h-[360px]">
                <Image
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