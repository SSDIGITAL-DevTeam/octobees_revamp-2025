"use client";

import type { CSSProperties, HTMLAttributes } from "react";

/**
 * Base shimmer block. Use this for any generic skeleton placeholder.
 * The actual shimmer comes from a moving gradient background.
 */
export const Shimmer = ({
  className = "",
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  const mergedStyle: CSSProperties = {
    backgroundImage:
      "linear-gradient(90deg, rgba(226,232,240,0.55) 0%, rgba(241,245,249,0.95) 40%, rgba(226,232,240,0.55) 80%)",
    backgroundSize: "200% 100%",
    ...style,
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-shimmer rounded-md bg-slate-200/60 ${className}`}
      style={mergedStyle}
      {...rest}
    />
  );
};

/* ---------- preset helpers ---------- */

type SkeletonTextProps = {
  /** number of text lines */
  lines?: number;
  className?: string;
  /** vary the width of each line for a more natural look */
  variedWidth?: boolean;
};

export const SkeletonText = ({
  lines = 3,
  className = "",
  variedWidth = true,
}: SkeletonTextProps) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, idx) => {
      const width = !variedWidth
        ? "100%"
        : idx === lines - 1
          ? "60%"
          : idx % 3 === 0
            ? "92%"
            : idx % 3 === 1
              ? "78%"
              : "85%";
      return (
        <Shimmer
          key={idx}
          className="h-3"
          style={{ width }}
        />
      );
    })}
  </div>
);

export const SkeletonCircle = ({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <Shimmer
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
  />
);

/** Stat card skeleton that matches <StatCard /> dimensions. */
export const SkeletonStatCard = () => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-card sm:px-5">
    <Shimmer className="h-3 w-24" />
    <Shimmer className="my-5 h-8 w-32 sm:my-6" />
    <Shimmer className="h-3 w-20" />
    <Shimmer className="absolute bottom-[-24px] right-[-18px] h-20 w-20 rounded-full sm:bottom-[-30px] sm:right-[-20px] sm:h-[120px] sm:w-[120px]" />
  </div>
);

/** Grid of stat card skeletons (default 4 cards). */
export const SkeletonStatsGrid = ({ count = 4 }: { count?: number }) => (
  <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonStatCard key={i} />
    ))}
  </section>
);

/** Generic card skeleton — padded white rounded box with variable rows. */
export const SkeletonCard = ({
  className = "",
  rows = 4,
  headerLines = 2,
}: {
  className?: string;
  rows?: number;
  headerLines?: number;
}) => (
  <div className={`rounded-2xl bg-white p-5 shadow-card ${className}`}>
    <div className="space-y-2">
      {Array.from({ length: headerLines }).map((_, i) => (
        <Shimmer
          key={`h-${i}`}
          className="h-4"
          style={{ width: i === 0 ? "40%" : "65%" }}
        />
      ))}
    </div>
    <div className="mt-4 space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Shimmer
          key={`r-${i}`}
          className="h-3"
          style={{ width: i === rows - 1 ? "55%" : "100%" }}
        />
      ))}
    </div>
  </div>
);

/** Table skeleton — useful for lists (leads, commissions). */
export const SkeletonTable = ({
  rows = 6,
  columns = 5,
  showHeader = true,
  className = "",
}: {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}) => (
  <div className={`rounded-2xl bg-white p-4 shadow-card sm:p-6 ${className}`}>
    {showHeader ? (
      <div className="mb-4 flex items-center gap-3">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="ml-auto h-9 w-32 rounded-full" />
      </div>
    ) : null}

    <div className="overflow-hidden rounded-lg border border-slate-100">
      <div
        className="hidden gap-4 border-b border-slate-100 bg-slate-50/60 px-4 py-3 md:grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Shimmer key={`th-${i}`} className="h-3 w-20" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={`row-${r}`}
            className="grid gap-4 px-4 py-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((__, c) => (
              <Shimmer
                key={`cell-${r}-${c}`}
                className="h-3"
                style={{ width: c === 0 ? "70%" : c === columns - 1 ? "40%" : "85%" }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/** List skeleton — useful for kanban cards or vertical feeds. */
export const SkeletonList = ({
  items = 4,
  className = "",
}: {
  items?: number;
  className?: string;
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div
        key={i}
        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
      >
        <div className="flex items-start gap-3">
          <SkeletonCircle size={40} />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-3 w-1/2" />
            <Shimmer className="h-3 w-3/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/** Large hero/banner skeleton used for policy / panel headers. */
export const SkeletonBanner = ({ className = "" }: { className?: string }) => (
  <div
    className={`rounded-[28px] border border-slate-200 bg-white p-6 shadow-card sm:p-8 ${className}`}
  >
    <Shimmer className="h-3 w-32" />
    <Shimmer className="mt-3 h-6 w-2/3" />
    <Shimmer className="mt-3 h-3 w-full" />
    <Shimmer className="mt-2 h-3 w-4/5" />
  </div>
);

/** Paragraph of long-form text (T&C etc.) */
export const SkeletonProse = ({
  paragraphs = 4,
  className = "",
}: {
  paragraphs?: number;
  className?: string;
}) => (
  <div className={`space-y-5 ${className}`}>
    {Array.from({ length: paragraphs }).map((_, pi) => (
      <div key={pi} className="space-y-2">
        <Shimmer className="h-4 w-1/3" />
        <SkeletonText lines={4} />
      </div>
    ))}
  </div>
);

export default Shimmer;
