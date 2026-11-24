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
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
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
