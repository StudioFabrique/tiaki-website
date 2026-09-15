import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { getHomeContent } from "@/lib/content/home"
import type { SiteLocale } from "@/lib/i18n/config"

type HomeWhyProps = {
  locale: SiteLocale
}

export function HomeWhy({ locale }: HomeWhyProps) {
  const { why } = getHomeContent(locale)

  return (
    <section id="pourquoi" className="py-6 sm:py-8">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-tiaki-green">
          <div className="relative min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
            <Image
              src="/images/photos/daily-support.jpg"
              alt="Un moment d’accompagnement dans la vie quotidienne"
              fill
              sizes="100vw"
              className="object-cover"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content over image */}
            <div className="relative z-10 flex min-h-[420px] items-end p-7 sm:min-h-[500px] sm:p-10 lg:min-h-[580px] lg:p-14">
              <div className="max-w-4xl">
                <h2 className="font-heading text-4xl leading-[0.98] font-bold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                  {why.title}
                </h2>

                <p className="mt-7 max-w-3xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                  {why.description}
                </p>
              </div>
            </div>
          </div>

          {/* Needs */}
          <div className="border-t border-white/20">
            <div className="grid md:grid-cols-3">
              {why.items.map((item, index) => (
                <div
                  key={item.title}
                  className="border-b border-white/20 p-7 last:border-b-0 sm:p-8 md:border-r md:border-b-0 md:last:border-r-0"
                >
                  {/* <div className="font-heading text-sm font-semibold text-white/55">
                    {String(index + 1).padStart(2, "0")}
                  </div> */}

                  <h3 className="mt-2 font-heading text-2xl font-semibold tracking-[-0.025em] text-white">
                    {item.title}
                  </h3>

                  <p className="mt-4 max-w-sm leading-7 text-white/75">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
