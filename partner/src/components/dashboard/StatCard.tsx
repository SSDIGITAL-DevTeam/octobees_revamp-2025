import Image, { type StaticImageData } from "next/image";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  // bisa string dari /public atau static import (PNG/WEBP, dsb)
  images: string | StaticImageData;
  accentColor?: string;
};

const StatCard = ({
  title,
  value,
  subtitle,
  images,
  accentColor,
}: StatCardProps) => {
  const accent = Boolean(accentColor);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${
        accent
          ? "border-transparent text-white shadow-none"
          : "border-slate-200 bg-white shadow-card"
      }`}
      style={accent ? { backgroundColor: accentColor } : undefined}
    >
      {/* TEXT */}
      <div className="relative z-10">
        <p
          className={`text-sm font-medium ${
            accent ? "text-white/80" : "text-black"
          }`}
        >
          {title}
        </p>

        <p className="my-6 text-3xl font-semibold">{value}</p>

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

      {/* ICON – pojok kiri bawah, sedikit terpotong */}
      <Image
        src={images}
        alt={title}
        width={120}
        height={120}
        className="absolute bottom-[-30px] right-[-20px]"
      />
    </div>
  );
};

export default StatCard;
