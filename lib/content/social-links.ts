
import socialLinksData from "@/content/data/social-links.json"

export type SocialLink = {
  id: string
  platform: string
  label: string
  icon: string
  url: string
  enabled: boolean
  order: number
}

export function getSocialLinks(): SocialLink[] {
  return socialLinksData.links
    .filter(
      (link) =>
        link.enabled &&
        link.url.startsWith("https://")
    )
    .sort((a, b) => a.order - b.order)
}
