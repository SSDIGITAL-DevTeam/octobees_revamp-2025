const CATEGORY_TO_SERVICE: Record<string, Array<{ label: string; href: string }>> = {
  marketing: [
    { label: "Increase my sales", href: "/increase-my-sales" },
    { label: "Ads campaign plan", href: "/plans/ads-campaign" },
  ],
  "marketing-strategies": [
    { label: "Social media management", href: "/plans/social-media-management" },
  ],
  seo: [
    { label: "Website optimization plan", href: "/plans/website" },
    { label: "Book a strategy call", href: "/contact-us" },
  ],
  technology: [
    { label: "Digital squad as a service", href: "/plans/digital-squad-as-a-service-new" },
    { label: "Increase my sales", href: "/increase-my-sales" },
  ],
};

export default function RelatedServices({
  categorySlug,
}: {
  categorySlug?: string;
}) {
  if (!categorySlug) return null;
  const items = CATEGORY_TO_SERVICE[categorySlug] ?? [];
  if (!items.length) return null;

  return (
    <aside className="rounded-3xl border border-gray-200 p-6 shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-primary mb-4">
        Related services
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="hover:underline text-gray-800">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
