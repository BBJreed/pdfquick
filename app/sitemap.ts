import type { MetadataRoute } from "next";
import { SITE, TOOLS } from "@/lib/config";
import { LANDINGS, POSTS } from "@/lib/landings";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now },
    { url: `${SITE.url}/pricing`, lastModified: now },
    { url: `${SITE.url}/privacy`, lastModified: now },
    { url: `${SITE.url}/alternatives`, lastModified: now },
    { url: `${SITE.url}/start`, lastModified: now },
    { url: `${SITE.url}/redact/ssn-from-pdf`, lastModified: now },
    { url: `${SITE.url}/redact/bank-statements-for-mortgage`, lastModified: now },
    { url: `${SITE.url}/redact/tax-returns`, lastModified: now },
    { url: `${SITE.url}/redact/court-documents-filing`, lastModified: now },
    { url: `${SITE.url}/redact/medical-records-hipaa`, lastModified: now },
    { url: `${SITE.url}/redact/w2-tax-form`, lastModified: now },
    { url: `${SITE.url}/flatten-redacted-pdf`, lastModified: now },
    { url: `${SITE.url}/blog`, lastModified: now },
    ...TOOLS.map((tool) => ({
      url: `${SITE.url}${tool.href}`,
      lastModified: now,
    })),
    ...LANDINGS.map((page) => ({
      url: `${SITE.url}/${page.slug}`,
      lastModified: now,
    })),
    ...POSTS.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: now,
    })),
  ];
}
