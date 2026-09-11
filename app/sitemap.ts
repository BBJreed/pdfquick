import type { MetadataRoute } from "next";
import { SITE, TOOLS } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now },
    { url: `${SITE.url}/pricing`, lastModified: now },
    { url: `${SITE.url}/privacy`, lastModified: now },
    ...TOOLS.map((tool) => ({
      url: `${SITE.url}${tool.href}`,
      lastModified: now,
    })),
  ];
}
