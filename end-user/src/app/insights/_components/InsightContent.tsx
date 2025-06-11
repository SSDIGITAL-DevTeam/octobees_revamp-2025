export default function InsightContent({ content, className }: { content: string; className?:string }) {
    return (
      <div
        className={`prose lg:prose-lg max-w-none !leading-[150%] ${className} `}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  