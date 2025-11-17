import { injectInternalLinks } from "@/lib/seo/internal-links";

export default function InsightContent({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const hydrated = injectInternalLinks(content);
  return (
    <div
      className={`prose lg:prose-lg max-w-none !leading-[150%] ${className} `}
      dangerouslySetInnerHTML={{ __html: hydrated }}
    />
  );
}
