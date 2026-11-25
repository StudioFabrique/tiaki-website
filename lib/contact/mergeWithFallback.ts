
function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

export function mergeWithFallback(
  source: unknown,
  fallback: unknown
): unknown {
  if (typeof fallback === "string") {
    return typeof source === "string" && source.trim().length > 0
      ? source.trim()
      : fallback
  }

  if (isRecord(fallback)) {
    const sourceObject = isRecord(source) ? source : {}

    return Object.fromEntries(
      Object.entries(fallback).map(([key, value]) => [
        key,
        mergeWithFallback(sourceObject[key], value),
      ])
    )
  }

  return fallback
}
