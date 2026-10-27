"use client"

import Link from "next/link"
import { useState } from "react"

import type { SiteLocale } from "@/lib/i18n/config"
import { contactSubjects, contactProfiles } from "@/lib/contact/contact"
import { Button } from "@/components/ui/button"

import { Send, FileText } from "lucide-react"

import {
  validateContactForm,
  type ContactFormValues,
  type ContactFormErrors,
} from "@/lib/contact/validation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ContactFormProps = {
  locale: SiteLocale
}

export function ContactForm({ locale }: ContactFormProps) {
  const isFrench = locale === "fr"

  const [values, setValues] = useState<ContactFormValues>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<ContactFormErrors>({})

  const [validatedValues, setValidatedValues] =
    useState<ContactFormValues | null>(null)

  const isValidationSuccessful =
    validatedValues !== null &&
    values.fullName === validatedValues.fullName &&
    values.email === validatedValues.email &&
    values.subject === validatedValues.subject &&
    values.message === validatedValues.message

  const [hasSubmitted, setHasSubmitted] = useState(false)

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
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
            {isFrench ? "Nom et prénom" : "Nombre y apellidos"}
            <span aria-hidden="true"> *</span>
            <span className="sr-only">
              {isFrench ? " (obligatoire)" : " (obligatorio)"}
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
            {isFrench ? "Adresse e-mail" : "Correo electrónico"}
            <span aria-hidden="true"> *</span>
            <span className="sr-only">
              {isFrench ? " (obligatoire)" : " (obligatorio)"}
            </span>
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
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
            {isFrench ? "Votre profil" : "Tu perfil"}
            <span className="ml-2 font-normal text-muted-foreground">
              {isFrench ? "(facultatif)" : "(opcional)"}
            </span>
          </label>

          <Select name="profile" items={contactProfiles[locale]}>
            <SelectTrigger id="contact-profile" className="min-h-11 w-full">
              <SelectValue
                placeholder={
                  isFrench
                    ? "Sélectionnez votre profil"
                    : "Selecciona tu perfil"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {contactProfiles[locale].map((profile) => (
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
            {isFrench ? "Objet de la demande" : "Asunto de la consulta"}
            <span aria-hidden="true"> *</span>
            <span className="sr-only">
              {isFrench ? " (obligatoire)" : " (obligatorio)"}
            </span>
          </label>

          <Select
            name="subject"
            required
            items={contactSubjects[locale]}
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
              <SelectValue
                placeholder={
                  isFrench ? "Sélectionnez un objet" : "Selecciona un asunto"
                }
              />
            </SelectTrigger>

            <SelectContent>
              {contactSubjects[locale].map((subject) => (
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
          {isFrench ? "Votre message" : "Tu mensaje"}
          <span aria-hidden="true"> *</span>
          <span className="sr-only">
            {isFrench ? " (obligatoire)" : " (obligatorio)"}
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

          placeholder={
            isFrench ? "Décrivez votre demande..." : "Describe tu consulta..."
          }
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
          {isFrench
            ? "Merci de ne pas inclure de données médicales ou de santé personnelles dans votre message."
            : "Por favor, no incluyas datos médicos ni información personal de salud en tu mensaje."}
        </p>
      </div>

      {/* button  */}

      {isValidationSuccessful && (
        <p role="status" className="text-sm font-medium text-foreground">
          {isFrench
            ? "Formulaire valide. Aucun message n'a été envoyé."
            : "Formulario válido. No se ha enviado ningún mensaje."}
        </p>
      )}
      <div className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Politique de confidentialité */}
        <div className="space-y-2">
          <Link
            href={isFrench ? "/fr/cgu" : "/es/condiciones-de-uso"}
            className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <FileText aria-hidden="true" className="size-4 shrink-0" />
            {isFrench
              ? "Politique de confidentialité"
              : "Política de privacidad"}
          </Link>
        </div>

        {/* Bouton d'envoi */}

        <div className="flex flex-col gap-3 sm:items-end">
          <Button
            type="submit"
            // disabled
            className="min-h-11 w-full gap-2 px-6 sm:w-auto"
          >
            {/* {isFrench ? "Envoyer le message" : "Enviar el mensaje"} */}

            {isFrench ? "Vérifier le formulaire" : "Comprobar el formulario"}

            <Send aria-hidden="true" className="size-4 shrink-0" />
          </Button>

          <p className="text-sm text-muted-foreground sm:text-right">
            {isFrench
              ? "L'envoi des messages sera disponible prochainement."
              : "El envío de mensajes estará disponible próximamente."}
          </p>
        </div>
      </div>
    </form>
  )
}
