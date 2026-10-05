"use client";

import {
  BadgePercent,
  CalendarRange,
  Euro,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Container } from "@/components/layout/Container";
import { getHomeContent } from "@/lib/content/home";
import type { SiteLocale } from "@/lib/i18n/config";

type HomeStatsProps = {
  locale: SiteLocale;
};

type NumberStat = {
  type: "number";
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  icon: string;
};

type RangeStat = {
  type: "range";
  start: number;
  end: number;
  label: string;
  icon: string;
};

type StatItem = NumberStat | RangeStat;

const icons: Record<string, LucideIcon> = {
  calendar: CalendarRange,
  euro: Euro,
  percent: BadgePercent,
};

function useAnimatedNumber(
  from: number,
  to: number,
  start: boolean,
  duration = 1400
) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!start) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setValue(to);
      return;
    }

    let frameId = 0;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) {
        startTime = time;
      }

      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      // Ease-out cubic
      const eased =
        1 - Math.pow(1 - progress, 3);

      setValue(
        from + (to - from) * eased
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [from, to, start, duration]);

  return value;
}

function AnimatedNumber({
  value,
  decimals,
  suffix,
  locale,
  start,
}: {
  value: number;
  decimals: number;
  suffix: string;
  locale: SiteLocale;
  start: boolean;
}) {
  const animatedValue = useAnimatedNumber(
    0,
    value,
    start
  );

  const formattedValue =
    new Intl.NumberFormat(
      locale === "fr" ? "fr-FR" : "es-ES",
      {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }
    ).format(animatedValue);

  return (
    <>
      {formattedValue}
      {suffix}
    </>
  );
}

function AnimatedRange({
  startYear,
  endYear,
  start,
}: {
  startYear: number;
  endYear: number;
  start: boolean;
}) {
  const animatedEnd = useAnimatedNumber(
    startYear,
    endYear,
    start,
    1200
  );

  return (
    <>
      {startYear}–{Math.round(animatedEnd)}
    </>
  );
}

export function HomeStats({
  locale,
}: HomeStatsProps) {
  const { stats } = getHomeContent(locale);

  const sectionRef =
    useRef<HTMLElement | null>(null);

  const [isVisible, setIsVisible] =
    useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const items =
    stats.items as StatItem[];

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-12 lg:py-10"
    >
      <Container>
        <div className="max-w-5xl">
          <h2 className="font-heading text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {stats.title}
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {stats.description}
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border">
          <div className="grid md:grid-cols-3">
            {items.map((item, index) => {
              const Icon =
                icons[item.icon];

              return (
                <article
                  key={item.label}
                  className="flex min-h-[300px] flex-col border-b p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-9 lg:p-10"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-tiaki-green/10">
                    {Icon && (
                      <Icon className="size-5 text-tiaki-green" />
                    )}
                  </div>

                  <div className="mt-auto pt-14">
                    <div className="font-heading text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                      {item.type === "number" ? (
                        <AnimatedNumber
                          value={item.value}
                          decimals={item.decimals}
                          suffix={item.suffix}
                          locale={locale}
                          start={isVisible}
                        />
                      ) : (
                        <AnimatedRange
                          startYear={item.start}
                          endYear={item.end}
                          start={isVisible}
                        />
                      )}
                    </div>

                    <p className="mt-4 font-heading text-base font-medium text-foreground/60">
                      {item.label}
                    </p>

                    {/* <span className="mt-8 block font-heading text-xs font-semibold text-foreground/25">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span> */}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}