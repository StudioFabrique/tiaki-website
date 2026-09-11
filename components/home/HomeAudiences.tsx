import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { getHomeContent } from "@/lib/content/home";
import type { SiteLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type HomeAudiencesProps = {
  locale: SiteLocale;
};

const audienceStyles = [
  {
    background: "bg-tiaki-blue/25",
    image: "/images/pictos/picto-4.png",
  },
  {
    background: "bg-tiaki-orange/15",
    image: "/images/pictos/picto-9-orange.png",
  },
  {
    background: "bg-tiaki-green/10",
    image: "/images/pictos/picto-3.png",
  },
  {
    background: "bg-muted",
    image: "/images/pictos/picto-6-orange.png",
  },
];

export function HomeAudiences({
  locale,
}: HomeAudiencesProps) {
  const { audiences } = getHomeContent(locale);

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Section introduction */}
        <div className="max-w-4xl">
          <h2 className="font-heading text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {audiences.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {audiences.description}
          </p>
        </div>

        {/* Audience blocks */}
        <div className="mt-12 space-y-4">
          {audiences.items.map((item, index) => {
            const style = audienceStyles[index];
            const reversed = index % 2 === 1;

            return (
              <article
                key={item.title}
                className={cn(
                  "overflow-hidden rounded-[2rem]",
                  style.background
                )}
              >
                <div className="grid min-h-[420px] lg:grid-cols-2">
                  {/* Text */}
                  <div
                    className={cn(
                      "flex items-center p-7 sm:p-10 lg:p-14",
                      reversed && "lg:order-2"
                    )}
                  >
                    <div>
                      <span className="font-heading text-sm font-semibold text-foreground/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="mt-5 font-heading text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                        {item.title}
                      </h3>

                      <p className="mt-5 text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Illustration */}
                  <div
                    className={cn(
                      "flex min-h-[320px] items-center justify-center p-8 sm:p-10 lg:min-h-0 lg:p-12",
                      reversed && "lg:order-1"
                    )}
                  >
                    <div className="relative h-[280px] w-full sm:h-[320px] lg:h-[340px]">
                      <Image
                        src={style.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 45vw, 90vw"
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}