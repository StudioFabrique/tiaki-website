import Image from "next/image";
import { Check } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { getHomeContent } from "@/lib/content/home";
import type { SiteLocale } from "@/lib/i18n/config";

type HomeCooperationProps = {
  locale: SiteLocale;
};

export function HomeCooperation({
  locale,
}: HomeCooperationProps) {
  const { cooperation } = getHomeContent(locale);

  return (
    <section className="py-2 sm:py-2 lg:py-12">
      <Container>
        <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] sm:min-h-[680px] lg:min-h-[720px]">
          {/* Full background image */}
          <Image
            src="/images/photos/cooperation.jpg"
            alt="Des professionnels collaborant autour du projet T-IA-KI"
            fill
            sizes="100vw"
            className="object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative z-10 flex min-h-[620px] flex-col justify-between p-7 sm:min-h-[680px] sm:p-10 lg:min-h-[720px] lg:p-14">
            {/* Heading */}
            <div className="max-w-4xl">
              <h2 className="font-heading text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                {cooperation.title}
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                {cooperation.description}
              </p>
            </div>

            {/* Key points */}
            <div className="mt-16 grid gap-3 md:grid-cols-3">
              {cooperation.items.map((item) => (
                <div
                  key={item}
                  className="flex min-h-[90px] items-center gap-4 rounded-[1.5rem] border border-white/20 bg-black/20 p-5 backdrop-blur-sm sm:p-6"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tiaki-orange">
                    <Check className="size-4 text-white" />
                  </div>

                  <p className="font-heading text-base font-semibold leading-6 text-white sm:text-lg">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}