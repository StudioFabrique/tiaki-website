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
          <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <div className="max-w-4xl">
              <h1 className="font-heading text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                {content.hero.title}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
                {content.hero.description}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}