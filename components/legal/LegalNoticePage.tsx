
import { Container } from "@/components/layout/Container";
import type { SiteLocale } from "@/lib/i18n/config";

import frLegal from "@/content/fr/legal.json";
import esLegal from "@/content/es/legal.json";

type LegalNoticePageProps = {
  locale: SiteLocale;
};

export function LegalNoticePage({
  locale,
}: LegalNoticePageProps) {
  const content = locale === "fr" ? frLegal : esLegal;

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <Container>
        {/* Introduction */}
        <div className="rounded-[2rem] bg-tiaki-blue/20 px-7 py-12 sm:px-10 lg:px-12 lg:py-16">
          <h1 className="font-heading text-4xl font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>

          <p className="mt-6 max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
            {content.description}
          </p>
        </div>

        {/* Legal information */}
        <div className="mx-auto max-w-4xl py-12 sm:py-16">
          <div className="mb-10 rounded-2xl border border-border bg-muted/40 p-5 text-sm leading-7 text-muted-foreground">
            {content.notice}
          </div>

          <div className="grid gap-4">
            {content.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-[1.5rem] border border-border bg-card p-6 sm:p-8"
              >
                <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  {section.title}
                </h2>

                <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">
                  {section.description}
                </p>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
