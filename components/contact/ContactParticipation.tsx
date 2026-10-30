
"use client"

import { useState } from "react"

import type { SiteLocale } from "@/lib/i18n/config"
import type {
  ParticipationAudience,
  ParticipationActivity,
} from "@/lib/contact/participation"

import { Container } from "@/components/layout/Container"

import {
  HandHeart,
  UsersRound,
  Building2,
  MessageSquareText,
  Users,
  MousePointerClick,
  Handshake,
} from "lucide-react"

type ContactParticipationProps = {
  locale: SiteLocale
  audiences: ParticipationAudience[]
  activities: ParticipationActivity[]
}

export function ContactParticipation({
  locale,
  audiences,
  activities,
}: ContactParticipationProps) {
  const isFrench = locale === "fr"

  const [activeAudience, setActiveAudience] = useState("caregivers")

  return (
    <section
      aria-labelledby="contact-participation-title"
      className="py-12 sm:py-16"
    >
      <Container>
        {/* Présentation et cartes interactives */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.65fr)] lg:items-center">

          {/* Texte à gauche */}
          <div className="max-w-md">
            <h2
              id="contact-participation-title"
              className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
            >
              {isFrench
                ? "Construisons T-IA-KI ensemble"
                : "Construyamos T-IA-KI juntos"}
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {isFrench
                ? "Votre expérience, vos idées et vos connaissances peuvent contribuer à construire une plateforme adaptée aux besoins des aidant(e)s."
                : "Tu experiencia, tus ideas y tus conocimientos pueden contribuir al desarrollo de una plataforma adaptada a las necesidades de las personas cuidadoras."}
            </p>
          </div>

          {/* Cartes extensibles */}
          <div
            role="group"
            aria-label={
              isFrench
                ? "Publics pouvant participer au projet"
                : "Públicos que pueden participar en el proyecto"
            }
            className="flex min-w-0 flex-col gap-3 lg:h-88 lg:flex-row"
          >
            {audiences.map((audience) => {
              const isActive = activeAudience === audience.id

              const Icon =
                audience.id === "caregivers"
                  ? HandHeart
                  : audience.id === "professionals"
                    ? UsersRound
                    : Building2

              const compactTitle =
                audience.id === "caregivers"
                  ? isFrench
                    ? "Aidant(e)s"
                    : "Personas cuidadoras"
                  : audience.id === "professionals"
                    ? isFrench
                      ? "Professionnels"
                      : "Profesionales"
                    : isFrench
                      ? "Organisations"
                      : "Organizaciones"

              const descriptionId =
                `participation-${audience.id}-description`

              return (
                <button
                  key={audience.id}
                  type="button"
                  aria-label={audience.title}
                  aria-pressed={isActive}
                  aria-describedby={
                    isActive ? descriptionId : undefined
                  }
                  onClick={() => setActiveAudience(audience.id)}
                  className={`
                    relative block min-w-0 overflow-hidden
                    rounded-2xl border p-5 text-left
                    transition-[flex-grow,background-color,border-color]
                    duration-500 ease-in-out
                    focus-visible:outline-none
                    focus-visible:ring-3 focus-visible:ring-ring/50
                    motion-reduce:transition-none
                    lg:basis-0 lg:p-6
                    ${
                      isActive
                        ? "border-primary bg-muted lg:grow-[3]"
                        : "border-border bg-background hover:bg-muted/40 lg:grow"
                    }
                  `}
                >
                  {/* Contenu de la carte ouverte */}
                  <span
                    className={`
                      block transition-opacity duration-300
                      motion-reduce:transition-none
                      ${
                        isActive
                          ? "lg:opacity-100 lg:delay-150"
                          : "lg:opacity-0"
                      }
                    `}
                  >
                    <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-background text-primary">
                      <Icon
                        aria-hidden="true"
                        className="size-6"
                      />
                    </span>

                    <span className="block font-heading text-lg font-bold text-foreground">
                      {audience.title}
                    </span>

                    {/* Description extensible sur mobile */}
                    <span
                      className={`
                        grid transition-[grid-template-rows]
                        duration-300 ease-in-out
                        motion-reduce:transition-none
                        lg:grid-rows-[1fr]
                        ${
                          isActive
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                        }
                      `}
                    >
                      <span className="min-h-0 overflow-hidden">
                        <span
                          id={descriptionId}
                          className="mt-3 block text-sm leading-6 text-muted-foreground"
                        >
                          {audience.description}
                        </span>
                      </span>
                    </span>
                  </span>

                  {/* Titre vertical : carte fermée sur desktop */}
                  <span
                    aria-hidden="true"
                    className={`
                      pointer-events-none absolute inset-0
                      hidden items-center justify-center
                      transition-opacity duration-300
                      motion-reduce:transition-none
                      lg:flex
                      ${
                        isActive
                          ? "lg:opacity-0"
                          : "lg:opacity-100"
                      }
                    `}
                  >
                    <span className="rotate-180 font-heading text-sm font-semibold text-foreground [writing-mode:vertical-rl]">
                      {compactTitle}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Formes de contribution */}
        <div className="mt-12">
          <h3 className="mb-6 font-heading text-xl font-bold text-foreground">
            {isFrench
              ? "Comment contribuer au projet ?"
              : "¿Cómo contribuir al proyecto?"}
          </h3>

          <ul className="grid gap-4 sm:grid-cols-2">
            {activities.map((activity) => {
              const Icon =
                activity.id === "experience"
                  ? MessageSquareText
                  : activity.id === "workshops"
                    ? Users
                    : activity.id === "testing"
                      ? MousePointerClick
                      : Handshake

              return (
                <li
                  key={activity.id}
                  className="rounded-xl border border-border bg-muted/30 p-5"
                >
                  <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-background text-primary">
                    <Icon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </span>

                  <h4 className="font-heading text-base font-bold text-foreground">
                    {activity.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {activity.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
