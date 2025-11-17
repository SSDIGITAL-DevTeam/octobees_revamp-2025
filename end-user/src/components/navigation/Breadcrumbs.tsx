import Link from "next/link";

export type BreadcrumbSegment = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ segments }: { segments: BreadcrumbSegment[] }) {
  if (!segments.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600 mb-6">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        {segments.map((segment, idx) => (
          <li key={`${segment.label}-${idx}`} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {segment.href ? (
              <Link href={segment.href} className="hover:underline">
                {segment.label}
              </Link>
            ) : (
              <span aria-current={idx === segments.length - 1 ? "page" : undefined}>
                {segment.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
