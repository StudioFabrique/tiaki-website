import Image from "next/image"

import { Container } from "@/components/layout/Container"
import { getHomeContent } from "@/lib/content/home"
import type { SiteLocale } from "@/lib/i18n/config"

type HomeFeaturesProps = {
  locale: SiteLocale
}

const featureStyles = [
  {
    className: "bg-tiaki-blue/30",
    image: "/images/pictos/picto-4.png",
  },
  {
    className: "bg-tiaki-orange/15",
    image: "/images/pictos/picto-5.png",
  },
  {
    className: "bg-tiaki-green/10",
    image: "/images/pictos/picto-6.png",
  },
  {
    className: "bg-muted",
    image: "/images/pictos/picto-7.png",
  },
]

export function HomeFeatures({ locale }: HomeFeaturesProps) {
  const { features } = getHomeContent(locale)

  return (
    <section className="py-8 sm:py-8 lg:py-12">
      <Container>
        <div className="max-w-3xl">
          <h2 className="font-heading text-4xl leading-[0.98] font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {features.title}
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {features.description}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.items.map((item, index) => {
            const style = featureStyles[index]

            return (
              <article
                key={item.title}
                className={[
                  "flex min-h-[520px] flex-col overflow-hidden rounded-[2rem]",
                  style.className,
                ].join(" ")}
              >
                {/* Text */}
                <div className="p-7 sm:p-9 lg:p-10">
                  <span className="font-heading text-sm font-semibold text-foreground/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-5 font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-foreground/65">
                    {item.description}
                  </p>
                </div>

                {/* Illustration */}
                <div className="mt-auto h-[280px] px-8 pb-8 sm:h-[300px] sm:px-10">
                  <div className="relative h-full w-full">
                    <Image
                      src={style.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      className="object-contain object-bottom"
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
