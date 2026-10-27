
import type { SiteLocale } from "@/lib/i18n/config"

export type ContactFormValues = {
  fullName: string
  email: string
  subject: string
  message: string
}

export type ContactFormErrors = Partial<
  Record<keyof ContactFormValues, string>
>

export function validateContactForm(
  values: ContactFormValues,
  locale: SiteLocale
): ContactFormErrors {
  const errors: ContactFormErrors = {}

  const requiredMessage =
    locale === "fr"
      ? "Ce champ est obligatoire."
      : "Este campo es obligatorio."

  // Nom et prénom
  if (!values.fullName.trim()) {
    errors.fullName = requiredMessage
  }

  // Adresse e-mail
  const email = values.email.trim()

  if (!email) {
    errors.email = requiredMessage
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email =
      locale === "fr"
        ? "Saisissez une adresse e-mail valide."
        : "Introduce una dirección de correo válida."
  }

  // Objet de la demande
  if (!values.subject.trim()) {
    errors.subject = requiredMessage
  }

  // Message
  if (!values.message.trim()) {
    errors.message = requiredMessage
  }

  return errors
}
