import Link from "next/link";
import {
  BadgeCheck,
  ExternalLink,
  MapPin,
} from "lucide-react";

import { getResourcesUI } from "@/lib/content/resources";
import type { SiteLocale } from "@/lib/i18n/config";
import type { Resource } from "@/lib/resources/types";

type ResourceCardProps = {
  resource: Resource;
  locale: SiteLocale;
};

function formatVerifiedDate(
  date: string,
  locale: SiteLocale
) {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat(
    locale === "fr" ? "fr-FR" : "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(
    new Date(
      Date.UTC(year, month - 1, day)
    )
  );
}

export function ResourceCard({
  resource,
  locale,
}: ResourceCardProps) {
  const content = getResourcesUI(locale);
  const localizedContent =
    resource.content[locale];

  const visibleTopics =
    resource.topics.slice(0, 2);

  const remainingTopics =
    Math.max(
      resource.topics.length -
        visibleTopics.length,
      0
    );

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-foreground/10 bg-background p-6 transition-shadow duration-200 hover:shadow-md sm:p-7">
      {/* Type + official status */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-tiaki-blue/25 px-3 py-1.5 font-heading text-xs font-semibold">
          {content.kinds[resource.kind]}
        </span>

        {resource.official && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tiaki-green/10 px-3 py-1.5 font-heading text-xs font-semibold text-tiaki-green">
            <BadgeCheck
              aria-hidden="true"
              className="size-3.5"
            />

            {content.card.official}
          </span>
        )}
      </div>

      {/* Main information */}
      <div className="mt-6">
        <h2 className="font-heading text-2xl font-semibold leading-tight tracking-[-0.025em]">
          {localizedContent.title}
        </h2>

        {resource.organization && (
          <p className="mt-2 font-heading text-sm font-semibold text-foreground/50">
            {resource.organization}
          </p>
        )}

        <p className="mt-5 leading-7 text-foreground/65">
          {localizedContent.description}
        </p>
      </div>

      {/* Topics */}
      {visibleTopics.length > 0 && (
        <div
          className="mt-6 flex flex-wrap gap-2"
          aria-label={content.filters.title}
        >
          {visibleTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/65"
            >
              {content.topics[topic]}
            </span>
          ))}

          {remainingTopics > 0 && (
            <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/50">
              +{remainingTopics}
            </span>
          )}
        </div>
      )}

      {/* Territory + beneficiary */}
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-foreground/10 pt-5 text-sm text-foreground/55">
        <span className="inline-flex items-center gap-2">
          <MapPin
            aria-hidden="true"
            className="size-4"
          />

          {content.scopes[resource.scope]}
        </span>

        <span>
          {content.card.beneficiary}:{" "}
          <strong className="font-medium text-foreground/70">
            {
              content.beneficiaries[
                resource.beneficiary
              ]
            }
          </strong>
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-7">
        {resource.lastVerified && (
          <p className="mb-4 text-xs leading-5 text-foreground/40">
            {content.card.verified}{" "}
            {formatVerifiedDate(
              resource.lastVerified,
              locale
            )}
          </p>
        )}

        <Link
          href={resource.url} target="_blank"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-heading text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {content.card.visit}

          <ExternalLink
            aria-hidden="true"
            className="size-4"
          />
        </Link>
      </div>
    </article>
  );
}