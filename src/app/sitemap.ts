import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  // Normalize base: strip trailing slash to avoid double slashes in URLs
  const normalizedBase = base.replace(/\/$/, "");
  const routes: MetadataRoute.Sitemap = [
    { url: normalizedBase, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${normalizedBase}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${normalizedBase}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${normalizedBase}/settings`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${normalizedBase}/pro/activate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${normalizedBase}/pro/customers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${normalizedBase}/tools/pool-volume`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${normalizedBase}/tools/chemical-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${normalizedBase}/tools/chlorine-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${normalizedBase}/tools/maintenance-schedule`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${normalizedBase}/tools/water-test-log`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${normalizedBase}/tools/service-report`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${normalizedBase}/guides/chemical-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${normalizedBase}/guides/pool-opening-closing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${normalizedBase}/guides/service-reports`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${normalizedBase}/guides/pool-volume-calculation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${normalizedBase}/guides/pool-maintenance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${normalizedBase}/guides/reading-test-results`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${normalizedBase}/guides/water-chemistry`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
  return routes;
}
