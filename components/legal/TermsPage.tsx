
import { Container } from "@/components/layout/Container";
import type { SiteLocale } from "@/lib/i18n/config";

import frTerms from "@/content/fr/terms.json";
import esTerms from "@/content/es/terms.json";

type TermsPageProps = {
  locale: SiteLocale;
};

export function TermsPage({ locale }: TermsPageProps) {
  const content = locale === "fr" ? frTerms : esTerms;

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <Container>
        {/* Introduction */}
        <div className="rounded-[2rem] bg-tiaki-green/10 px-7 py-12 sm:px-10 lg:px-12 lg:py-16">
          <h1 className="max-w-5xl font-heading text-4xl font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {content.description}
          </p>
        </div>

        {/* Document */}
        <div className="mx-auto max-w-4xl py-12 sm:py-16">
          <div className="mb-10 rounded-2xl border border-border bg-muted/40 p-5 text-sm leading-7 text-muted-foreground">
            {content.notice}
          </div>

          <div className="space-y-12">
            {content.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-b border-border pb-10 last:border-b-0"
              >
                <div className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="font-heading text-sm font-semibold text-tiaki-green"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                      {section.title}
                    </h2>

                    <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
