"use client"

import Link from "next/link"
import type { SiteLocale } from "@/lib/i18n/config"
import { contactSubjects, contactProfiles } from "@/lib/contact/contact"
import { Button } from "@/components/ui/button"

import { Send, FileText } from "lucide-react"


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

  return (
    <form
      aria-labelledby="contact-form-title"
      onSubmit={(event) => event.preventDefault()}
      className="space-y-2"
    >
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
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
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
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
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

          <Select name="subject" required items={contactSubjects[locale]}>
            <SelectTrigger id="contact-subject" className="min-h-11 w-full">
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
          name="message"
          rows={6}
          required
          aria-describedby="contact-message-hint"
          placeholder={
            isFrench ? "Décrivez votre demande..." : "Describe tu consulta..."
          }
          className="min-h-36 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-base leading-6 text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        />

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
            type="button"
            disabled
            className="min-h-11 w-full gap-2 px-6 sm:w-auto"
          >
            {isFrench ? "Envoyer le message" : "Enviar el mensaje"}
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
