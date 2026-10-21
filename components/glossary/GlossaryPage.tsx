"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"

import { Container } from "@/components/layout/Container"
import type { SiteLocale } from "@/lib/i18n/config"

import frGlossary from "@/content/fr/glossary.json"
import esGlossary from "@/content/es/glossary.json"

type GlossaryPageProps = {
  locale: SiteLocale
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function getFirstLetter(term: string, locale: SiteLocale) {
  const first = term.trim().charAt(0).toLocaleUpperCase(locale)

  // Conserver Ñ comme lettre distincte en espagnol.
  if (first === "Ñ") return "Ñ"

  return first.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function GlossaryPage({ locale }: GlossaryPageProps) {
  const content = locale === "fr" ? frGlossary : esGlossary

  const [search, setSearch] = useState("")

  const alphabet = (
    locale === "es"
      ? "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ).split("")

  const filteredEntries = useMemo(() => {
    const query = normalizeText(search)

    return content.entries
      .filter((entry) => {
        if (!query) return true

        const searchableText = normalizeText(
          [entry.term, entry.definition, ...(entry.keywords ?? [])].join(" ")
        )

        return searchableText.includes(query)
      })
      .sort((a, b) => a.term.localeCompare(b.term, locale))
  }, [content, locale, search])

  const groups = alphabet
    .map((letter) => ({
      letter,
      entries: filteredEntries.filter(
        (entry) => getFirstLetter(entry.term, locale) === letter
      ),
    }))
    .filter((group) => group.entries.length > 0)

  const availableLetters = new Set(groups.map((group) => group.letter))

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <Container>
        <div className="rounded-[2rem] bg-tiaki-green/10 px-7 py-12 sm:px-10 lg:px-12 lg:py-16">
          <h1 className="font-heading text-4xl font-bold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {content.description}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl">
          {/* Search */}
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
            />

            <input
              id="glossary-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={content.searchPlaceholder}
              placeholder={content.searchPlaceholder}
              className="h-14 w-full rounded-2xl border border-border bg-background pr-12 pl-14 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-tiaki-green focus-visible:ring-2 focus-visible:ring-tiaki-green/20"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label={
                  locale === "fr" ? "Effacer la recherche" : "Borrar búsqueda"
                }
                className="absolute top-1/2 right-4 flex size-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-muted"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>

          {/* Alphabet */}
          <nav aria-label={content.alphabetLabel} className="mt-8">
            <p className="mb-4 font-heading text-sm font-semibold">
              {content.alphabetLabel}
            </p>

            <div className="flex flex-wrap gap-2">
              {alphabet.map((letter) => {
                const available = availableLetters.has(letter)

                return available ? (
                  <a
                    key={letter}
                    href={`#glossary-${letter}`}
                    className="flex size-10 items-center justify-center rounded-xl border border-tiaki-green/20 bg-tiaki-green/10 font-heading text-sm font-semibold transition-colors hover:bg-tiaki-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {letter}
                  </a>
                ) : (
                  <span
                    key={letter}
                    aria-disabled="true"
                    className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-muted/40 font-heading text-sm text-muted-foreground/40"
                  >
                    {letter}
                  </span>
                )
              })}
            </div>
          </nav>

          {/* Result count */}
          <p aria-live="polite" className="mt-8 text-sm text-muted-foreground">
            {locale === "fr"
              ? `${filteredEntries.length} terme(s)`
              : `${filteredEntries.length} término(s)`}
          </p>

          {/* Glossary entries */}
          {groups.length > 0 ? (
            <div className="mt-8 space-y-12">
              {groups.map((group) => (
                <section
                  key={group.letter}
                  id={`glossary-${group.letter}`}
                  className="scroll-mt-28"
                  aria-labelledby={`heading-${group.letter}`}
                >
                  <h2
                    id={`heading-${group.letter}`}
                    tabIndex={-1}
                    className="mb-5 border-b border-border pb-4 font-heading text-4xl font-bold text-tiaki-blue"
                  >
                    {group.letter}
                  </h2>

                  <div className="space-y-3">
                    {group.entries.map((entry) => (
                      <article
                        key={entry.id}
                        id={`term-${entry.id}`}
                        className="scroll-mt-28 rounded-2xl border border-border bg-card p-6 sm:p-8"
                      >
                        <h3 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                          {entry.term}
                        </h3>

                        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                          {entry.definition}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl bg-muted/60 px-6 py-12 text-center">
              <p className="text-muted-foreground">{content.noResults}</p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 font-heading font-semibold text-tiaki-green underline underline-offset-4"
              >
                {locale === "fr" ? "Effacer la recherche" : "Borrar búsqueda"}
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
