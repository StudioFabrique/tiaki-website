import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { getHomeContent } from "@/lib/content/home"
import type { SiteLocale } from "@/lib/i18n/config"

type HomeFundingProps = {
  locale: SiteLocale
}

export function HomeFunding({ locale }: HomeFundingProps) {
  const { funding } = getHomeContent(locale)

  return (
    <section className="py-2 sm:py-6 lg:py-12">
      <Container>
        <div className="overflow-hidden rounded-[2rem] border bg-background">
          {/* Funding */}
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex items-center p-7 sm:p-10 lg:p-14">
              <div>
                <h2 className="font-heading text-4xl leading-[0.98] font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  {funding.title}
                </h2>

                <p className="mt-6 text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
                  {funding.description}
                </p>
              </div>
            </div>

            {/* POCTEFA logo */}
            <div className="flex min-h-[280px] items-center justify-center bg-muted/40 p-8 sm:p-10 lg:min-h-[420px] lg:p-14">
              <div className="relative h-[180px] w-full max-w-[460px] sm:h-[220px]">
                <Image
                  src="/images/logos/poctefa.png"
                  alt="POCTEFA - Interreg Espagne France Andorre"
                  fill
                  sizes="(min-width: 1024px) 35vw, 80vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Partners */}
          <div className="border-t">
            <div className="p-7 sm:p-10 lg:p-14">
              <h3 className="font-heading text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {funding.partnersTitle}
              </h3>

              <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-[1.5rem] border sm:grid-cols-3 lg:grid-cols-5">
                {funding.partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="group flex min-h-[130px] items-center justify-center border-r border-b p-6 last:border-r-0 sm:min-h-[150px]"
                  >
                    <div className="relative h-[72px] w-full">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        sizes="(min-width: 1024px) 15vw, 40vw"
                        className="object-contain opacity-60 saturate-0 transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:saturate-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
