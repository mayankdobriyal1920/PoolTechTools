import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/settings`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/pro/activate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/pro/customers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools/pool-volume`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tools/chemical-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tools/chlorine-calculator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tools/maintenance-schedule`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tools/water-test-log`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tools/service-report`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/guides/chemical-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guides/pool-opening-closing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guides/service-reports`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guides/pool-volume-calculation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guides/pool-maintenance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guides/reading-test-results`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/guides/water-chemistry`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
  return routes;
}
