import Image, { type StaticImageData } from "next/image";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  // bisa string dari /public atau static import (PNG/WEBP, dsb)
  images: string | StaticImageData;
  accentColor?: string;
  actionLabel?: string;
  actionAriaLabel?: string;
  onActionClick?: () => void;
};

const StatCard = ({
  title,
  value,
  subtitle,
  images,
  accentColor,
  actionLabel,
  actionAriaLabel,
  onActionClick,
}: StatCardProps) => {
  const accent = Boolean(accentColor);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-4 py-4 sm:px-5 ${
        accent
          ? "border-transparent text-white shadow-none"
          : "border-slate-200 bg-white shadow-card"
      }`}
      style={accent ? { backgroundColor: accentColor } : undefined}
    >
      {/* TEXT */}
      <div className="relative z-10">
        {onActionClick ? (
          <button
            type="button"
            onClick={onActionClick}
            aria-label={actionAriaLabel || actionLabel || `View ${title} details`}
            className={`absolute right-0 top-0 inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-xs font-semibold transition ${
              accent
                ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
                : "border-slate-200 bg-white text-slate-700 hover:border-[#E30613] hover:text-[#E30613]"
            }`}
          >
            {actionLabel || "Detail"}
          </button>
        ) : null}
        <p
          className={`pr-20 text-sm font-medium ${
            accent ? "text-white/80" : "text-black"
          }`}
        >
          {title}
        </p>

        <p className="my-4 text-2xl font-semibold sm:my-6 sm:text-3xl">{value}</p>

        {subtitle && (
          <p
            className={`mt-2 text-sm ${
              accent ? "text-white/90" : "text-[#E30613]"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      <Image
        src={images}
        alt={title}
        width={120}
        height={120}
        className="absolute bottom-[-24px] right-[-18px] h-20 w-20 sm:bottom-[-30px] sm:right-[-20px] sm:h-[120px] sm:w-[120px]"
      />
    </div>
  );
};

export default StatCard;
