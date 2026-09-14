import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/layout/Container"
import { getHomeContent } from "@/lib/content/home"
import type { SiteLocale } from "@/lib/i18n/config"

type HomeHeroProps = {
  locale: SiteLocale
}

export function HomeHero({ locale }: HomeHeroProps) {
  const { hero } = getHomeContent(locale)

  return (
    <section className="pt-4 sm:pt-6">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-tiaki-blue/35">
          <div className="grid min-h-[750px] lg:grid-cols-[0.95fr_1.05fr]">
            {/* Content */}
            <div className="order-2 flex items-center p-7 sm:p-10 lg:order-1 lg:p-14">
              <div className="max-w-3xl">
                <h1 className="font-heading text-5xl leading-[0.94] font-bold tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[3.5rem]">
                  {hero.title}
                </h1>

                <div className="mt-8">
                  <Link
                    href="#pourquoi"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 font-heading text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    {hero.primaryCta}

                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative order-1 min-h-[360px] overflow-hidden sm:min-h-[420px] lg:order-2 lg:min-h-0">
              <Image
                src="/images/photos/hero-caregiver.jpg"
                alt="Une aidante accompagnant une personne au quotidien"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
