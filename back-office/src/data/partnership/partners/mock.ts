import type { PartnerEntry, PartnerStatus } from "@/constrant/partnership"

const statuses: PartnerStatus[] = ["Active", "Non Active"]

const basePartners: PartnerEntry[] = [
  {
    id: "dafa-aulia",
    fullName: "Dafa Aulia",
    email: "dafa@gmail.com",
    phone: "+6275837293840",
    country: "Indonesia",
    status: "Active",
  },
  {
    id: "ryan-kusuma",
    fullName: "Ryan Kusuma",
    email: "ryan@gmail.com",
    phone: "+6275837293840",
    country: "Indonesia",
    status: "Non Active",
  },
]

export const partnerEntries: PartnerEntry[] = Array.from({ length: 12 }).map((_, index) => {
  if (index < basePartners.length) return basePartners[index]
  const base = basePartners[index % basePartners.length]
  return {
    ...base,
    id: `${base.id}-${index}`,
    status: statuses[index % statuses.length],
  }
})
