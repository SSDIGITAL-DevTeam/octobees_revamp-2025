"use client"

import Image from "next/image"
import type { StaticImageData } from "next/image"

type PartnerStatCardProps = {
  title: string
  value: string | number
  helper?: string
  accent?: string
  image?: StaticImageData
  dark?: boolean
}

export const PartnerStatCard = ({ title, value, helper, image, dark }: PartnerStatCardProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm ${
        dark ? "bg-red-700 text-white" : ""
      }`}
    >
      <div className="flex flex-col gap-2">
        <p className={`text-sm ${dark ? "text-white/90" : "text-slate-900"}`}>{title}</p>
        <p className="text-3xl font-semibold">{value}</p>
        {helper && (
          <p className={`text-sm font-medium ${dark ? "text-white/90" : "text-red-600"}`}>
            {helper}
          </p>
        )}
      </div>
      {image && (
        <div className="pointer-events-none absolute -bottom-8 -right-8">
          <Image src={image} alt={title} className="h-30 w-30 object-contain" />
        </div>
      )}
    </div>
  )
}

export default PartnerStatCard
