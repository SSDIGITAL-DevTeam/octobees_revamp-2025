import type { CommissionPayment } from "@/constrant/partnership"

export type PendingCommissionPayment = CommissionPayment & { id: string }

const paymentTemplates: CommissionPayment[] = [
  {
    partnerName: "Ahmad Rizki",
    service: "Digital Marketing",
    leadName: "CV Digital Media",
    amount: "IDR 4,000,000",
    status: "Pending Transfer",
  },
  {
    partnerName: "Sarah Putri",
    service: "Digital Marketing",
    leadName: "PT Satu Nusa",
    amount: "IDR 3,500,000",
    status: "Pending Transfer",
  },
]

export const PENDING_COMMISSION_PAGE_SIZE = 12
const TOTAL_PAGES = 27
const TOTAL_ENTRIES = TOTAL_PAGES * PENDING_COMMISSION_PAGE_SIZE

export const pendingCommissionPayments: PendingCommissionPayment[] = Array.from(
  { length: TOTAL_ENTRIES },
  (_, index) => {
    const template = paymentTemplates[index % paymentTemplates.length]
    return {
      ...template,
      id: `pending-commission-${index + 1}`,
    }
  }
)
