"use client"

import Link from "next/link"
import { useState } from "react"

import type { SiteLocale } from "@/lib/i18n/config"
import type { ContactSubmissionPayload } from "@/lib/contact/submission"
import type { ContactFormContent } from "@/lib/contact/types"
import {
  validateContactForm,
  type ContactFormValues,
  type ContactFormErrors,
} from "@/lib/contact/validation"

import { Send, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ContactFormProps = {
  locale: SiteLocale
  content: ContactFormContent
}

export function ContactForm({ locale, content }: ContactFormProps) {
  const isFrench = locale === "fr"

  // Options dynamiques provenant de Payload CMS
  const profileOptions = (
    [
      "caregiver",
      "professional",
      "association",
      "institution",
      "other",
    ] as const
  ).map((value) => ({
    value,
    label: content.profiles[value],
  }))

  const subjectOptions = (
    [
      "general",
      "platform",
      "resources",
      "content",
      "participation",
      "demo",
      "partnership",
      "technical",
      "other",
    ] as const
  ).map((value) => ({
    value,
    label: content.subjects[value],
  }))

  const discoverySourceOptions = Object.entries({
    google: "google",
    "search-engine": "searchEngine",
    linkedin: "linkedin",
    "social-media": "socialMedia",
    advertisement: "advertisement",
    "word-of-mouth": "wordOfMouth",
    event: "event",
    organization: "organization",
    other: "other",
  } as const).map(([value, key]) => ({
    value,
    label: content.discoveryOptions[key],
  }))

    // États du formulaire
  const [values, setValues] = useState<ContactSubmissionPayload>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    profile: null,
    discoverySource: null,
  })

  const [validatedValues, setValidatedValues] =
    useState<ContactSubmissionPayload | null>(null)

  const [errors, setErrors] = useState<ContactFormErrors>({})

  const isValidationSuccessful =
    validatedValues !== null &&
    values.fullName === validatedValues.fullName &&
    values.email === validatedValues.email &&
    values.subject === validatedValues.subject &&
    values.message === validatedValues.message &&
    values.profile === validatedValues.profile &&
    values.discoverySource === validatedValues.discoverySource

  const [hasSubmitted, setHasSubmitted] = useState(false)

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <>
      <h2
        id="contact-form-title"
        className="mb-6 font-heading text-2xl font-bold text-foreground sm:text-3xl"
      >
        {content.title}
      </h2>
      <form
        className="space-y-2"
        aria-labelledby="contact-form-title"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          setHasSubmitted(true)
          const nextErrors = validateContactForm(values, locale)
          setErrors(nextErrors)

          setValidatedValues(
            Object.keys(nextErrors).length === 0 ? { ...values } : null
          )

          const firstInvalidField = (
            Object.keys(nextErrors) as (keyof ContactFormValues)[]
          )[0]

          if (firstInvalidField) {
            const fieldIds: Record<keyof ContactFormValues, string> = {
              fullName: "contact-full-name",
              email: "contact-email",
              subject: "contact-subject",
              message: "contact-message",
            }

            const form = event.currentTarget

            requestAnimationFrame(() => {
              form
                .querySelector<HTMLElement>(`#${fieldIds[firstInvalidField]}`)
                ?.focus()
            })
          }
        }}
      >
        {errorCount > 0 && (
          <p
            role="status"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground"
          >
            {isFrench
              ? `Le formulaire contient ${errorCount} ${
                  errorCount === 1 ? "erreur" : "erreurs"
                }. Corrigez les champs indiqués.`
              : `El formulario contiene ${errorCount} ${
                  errorCount === 1 ? "error" : "errores"
                }. Corrige los campos indicados.`}
          </p>
        )}

        <div className="grid gap-4 pb-4 sm:grid-cols-2">
          {/* Nom et prénom */}
          <div className="min-w-0 space-y-2">
            <label
              htmlFor="contact-full-name"
              className="block text-sm font-medium text-foreground"
            >
              {content.labels.fullName}
              <span aria-hidden="true"> *</span>
              <span className="sr-only">{" "}
                {content.labels.required}
              </span>
            </label>

            <input
              id="contact-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName ? "contact-full-name-error" : undefined
              }
              value={values.fullName}

              onChange={(event) => {
                const fullName = event.target.value
                const nextValues = { ...values, fullName }

                setValues(nextValues)

                if (hasSubmitted) {
                  const nextErrors = validateContactForm(nextValues, locale)

                  setErrors((current) => ({
                    ...current,
                    fullName: nextErrors.fullName,
                  }))
                }
              }}
              className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20"
            />

            {errors.fullName && (
              <p
                id="contact-full-name-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Adresse e-mail */}
          <div className="min-w-0 space-y-2">
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-foreground"
            >
              {content.labels.email}
              <span aria-hidden="true"> *</span>
              <span className="sr-only">{" "}
                {content.labels.required}
              </span>
            </label>

            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "contact-email-error" : undefined
              }
              value={values.email}

              onChange={(event) => {
                const email = event.target.value
                const nextValues = { ...values, email }

                setValues(nextValues)

                if (hasSubmitted) {
                  const nextErrors = validateContactForm(nextValues, locale)

                  setErrors((current) => ({
                    ...current,
                    email: nextErrors.email,
                  }))
                }
              }}

              className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20"
            />
            {errors.email && (
              <p
                id="contact-email-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Profile  */}
        <div className="grid gap-4 pb-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <label
              htmlFor="contact-profile"
              className="block text-sm font-medium text-foreground"
            >
              {content.labels.profile}
              <span className="ml-2 font-normal text-muted-foreground">
                {content.labels.optional}
              </span>
            </label>

            <Select
              name="profile"
              items={profileOptions}
              value={values.profile}
              onValueChange={(profile) => {
                setValues((current) => ({ ...current, profile }))
              }}
            >
              <SelectTrigger id="contact-profile" className="min-h-11 w-full">
                <SelectValue placeholder={content.placeholders.profile} />
              </SelectTrigger>

              <SelectContent>
                {profileOptions.map((profile) => (
                  <SelectItem key={profile.value} value={profile.value}>
                    {profile.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Demand Subject */}
          <div className="min-w-0 space-y-2">
            <label
              htmlFor="contact-subject"
              className="block text-sm font-medium text-foreground"
            >
              {content.labels.subject}
              <span aria-hidden="true"> *</span>
              <span className="sr-only">{" "}
                {content.labels.required}
              </span>
            </label>

            <Select
              name="subject"
              required
              items={subjectOptions}
              value={values.subject || null}

              onValueChange={(subject) => {
                const nextSubject = subject ?? ""
                const nextValues = { ...values, subject: nextSubject }

                setValues(nextValues)

                if (hasSubmitted) {
                  const nextErrors = validateContactForm(nextValues, locale)

                  setErrors((current) => ({
                    ...current,
                    subject: nextErrors.subject,
                  }))
                }
              }}
            >
              <SelectTrigger
                id="contact-subject"

                className="min-h-11 w-full aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20"

                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? "contact-subject-error" : undefined
                }
              >
                <SelectValue placeholder={content.placeholders.subject} />
              </SelectTrigger>

              <SelectContent>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.subject && (
              <p
                id="contact-subject-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.subject}
              </p>
            )}
          </div>
        </div>
        {/* Message */}
        <div className="space-y-2 pt-4">
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-foreground"
          >
            {content.labels.message}
            <span aria-hidden="true"> *</span>
            <span className="sr-only">{" "}
             {content.labels.required}
            </span>
          </label>

          <textarea
            id="contact-message"
            className="min-h-36 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-base leading-6 text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-destructive/20"
            name="message"
            rows={6}
            required
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message
                ? "contact-message-hint contact-message-error"
                : "contact-message-hint"
            }

            value={values.message}

            onChange={(event) => {
              const message = event.target.value
              const nextValues = { ...values, message }

              setValues(nextValues)

              if (hasSubmitted) {
                const nextErrors = validateContactForm(nextValues, locale)

                setErrors((current) => ({
                  ...current,
                  message: nextErrors.message,
                }))
              }
            }}

            placeholder={content.placeholders.message}
          />

          {errors.message && (
            <p
              id="contact-message-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.message}
            </p>
          )}

          <p
            id="contact-message-hint"
            className="text-sm leading-6 text-muted-foreground"
          >
            {content.hints.message}
          </p>
        </div>

        {/* TIAKI platform finding */}

        <div className="mt-8 space-y-2">
          <label
            htmlFor="discovery-source"
            className="block text-sm font-medium text-foreground"
          >
            {content.labels.discoverySource}
          </label>

          <Select
            name="discoverySource"
            items={discoverySourceOptions}
            value={values.discoverySource}
            onValueChange={(discoverySource) => {
              setValues((current) => ({ ...current, discoverySource }))
            }}
          >
            <SelectTrigger id="discovery-source" className="w-full">
              <SelectValue placeholder={content.placeholders.discoverySource} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {discoverySourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <p className="text-xs leading-5 text-muted-foreground">
            {content.hints.discoverySource}
          </p>
        </div>

        {/* button  */}

        {isValidationSuccessful && (
          <p role="status" className="text-sm font-medium text-foreground">
            {content.messages.validationSuccess}
          </p>
        )}
        <div className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Politique de confidentialité */}
          <div className="space-y-2">
            <Link
              href={isFrench ? "/fr/#" : "/es/#"}
              className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <FileText aria-hidden="true" className="size-4 shrink-0" />
              {content.privacyLabel}
            </Link>
          </div>

          {/* Bouton d'envoi */}

          <div className="flex flex-col gap-3 sm:items-end">
            <Button
              type="submit"
              disabled
              className="min-h-11 w-full gap-2 px-6 sm:w-auto"
            >
              {content.submitLabel}

              {/* {isFrench ? "Vérifier le formulaire" : "Comprobar el formulario"} */}

              <Send aria-hidden="true" className="size-4 shrink-0" />
            </Button>

            <p className="text-sm text-muted-foreground sm:text-right">
              {content.messages.submissionUnavailable}
            </p>
          </div>
        </div>
      </form>
    </>
  )
}
