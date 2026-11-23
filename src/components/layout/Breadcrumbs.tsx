import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-brand-800">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-brand-600">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-600 hover:underline">{item.label}</Link>
            ) : (
              <span className="font-medium text-brand-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
