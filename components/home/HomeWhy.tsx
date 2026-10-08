import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/layout/Container"
import { getHomeContent } from "@/lib/content/home"
import { getLocalizedPath, type SiteLocale } from "@/lib/i18n/config"

type HomeWhyProps = {
  locale: SiteLocale
}

export function HomeWhy({ locale }: HomeWhyProps) {
  const { why } = getHomeContent(locale)

  return (
    <section id="pourquoi" className="py-6 sm:py-8 lg:py-12">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-tiaki-green text-tiaki-green-foreground">
          {/* Introduction */}
          <div className="max-w-7xl px-7 pt-9 sm:px-10 sm:pt-11 lg:px-12 lg:pt-12">
            <h2 className="font-heading text-4xl leading-[0.98] font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              {why.title}
            </h2>

            <p className="mt-5 max-w-5xl text-base leading-7 text-tiaki-green-foreground/75 sm:text-lg sm:leading-8">
              {why.description}
            </p>
          </div>

          {/* Grid */}
          <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2 lg:p-6">
            {why.items.map((item, index) => (
              <article
                key={item.title}
                className="flex min-h-[250px] flex-col justify-between rounded-[1.5rem] border border-tiaki-green-foreground/15 bg-background/85 p-6 text-foreground sm:min-h-[270px] sm:p-7 lg:p-8"
              >
                <span
                  aria-hidden="true"
                  className="font-heading text-sm font-semibold tracking-[0.08em] text-muted-foreground"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="mt-8">
                  <h3 className="font-heading text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}

            {/* About CTA */}
            <Link
            data-a11y-focus-inset
              href={getLocalizedPath("about", locale)}
              className="group relative min-h-[250px] overflow-hidden rounded-[1.5rem] focus-visible:ring-2 focus-visible:ring-tiaki-green-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-tiaki-green focus-visible:outline-none sm:min-h-[270px]"
            >
              <Image
                data-a11y-grayscale-image
                src="/images/photos/daily-support.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />

              <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />

              <div className="relative z-10 flex min-h-[250px] items-end justify-between gap-6 p-6 text-white sm:min-h-[270px] sm:p-7 lg:p-8">
                <span className="max-w-sm font-heading text-2xl font-semibold tracking-[-0.025em]">
                  {why.aboutCta}
                </span>

                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:translate-x-1"
                >
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
