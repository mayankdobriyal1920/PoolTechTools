"use client";

import { useRouter } from "next/navigation";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  showBack?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="mb-6">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-brand-700 shadow-sm hover:bg-white"
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-brand-900 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-brand-700">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
