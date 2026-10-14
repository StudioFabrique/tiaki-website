"use client"

export type ChoiceOption<
  Value extends string | number,
  LabelKey extends string,
> = {
  value: Value
  labelKey: LabelKey
  preview?: string
}

export type ChoicePreferenceControlContent<LabelKey extends string> = {
  title: string
  description: string
  options: Record<LabelKey, string>
}

type ChoicePreferenceControlProps<
  Value extends string | number,
  LabelKey extends string,
> = {
  name: string
  content: ChoicePreferenceControlContent<LabelKey>
  options: readonly ChoiceOption<Value, LabelKey>[]
  value: Value
  onChange: (value: Value) => void
  density?: "default" | "compact"
}

export function ChoicePreferenceControl<
  Value extends string | number,
  LabelKey extends string,
>({
  name,
  content,
  options,
  value,
  onChange,
  density = "default",
}: ChoicePreferenceControlProps<Value, LabelKey>) {
  const gridClass =
    options.length === 4
      ? "grid-cols-4"
      : options.length === 3
        ? "grid-cols-3"
        : "grid-cols-2"

  return (
    <fieldset className="rounded-2xl border border-border bg-muted/30 p-4">
      <legend className="sr-only">{content.title}</legend>

      <div className="mb-4">
        <p className="font-medium text-foreground">{content.title}</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {content.description}
        </p>
      </div>

      <div className={`grid ${gridClass} gap-2`}>
        {options.map((option) => {
          const isSelected = value === option.value

          const sizeClass =
            density === "compact"
              ? "min-h-10 px-3 py-2"
              : option.preview
                ? "min-h-20 px-2 py-3"
                : "min-h-12 px-3 py-3"

          return (
            <label key={String(option.value)} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />

              <span
                className={[
                  "flex flex-col items-center justify-center gap-1",
                  "rounded-xl border border-border bg-background",
                  "text-center transition-colors",
                  "hover:bg-muted",
                  "peer-checked:border-foreground",
                  "peer-checked:bg-foreground",
                  "peer-checked:text-background",
                  "peer-checked:hover:bg-foreground",
                  "peer-checked:hover:text-background",
                  "peer-focus-visible:outline-none",
                  "peer-focus-visible:ring-2",
                  "peer-focus-visible:ring-ring",
                  "peer-focus-visible:ring-offset-2",
                  sizeClass,
                ].join(" ")}
              >
                {option.preview && (
                  <span aria-hidden="true" className="text-lg font-semibold">
                    {option.preview}
                  </span>
                )}

                <span
                  className={
                    option.preview
                      ? "text-xs font-medium"
                      : "text-sm font-medium"
                  }
                >
                  {content.options[option.labelKey]}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
