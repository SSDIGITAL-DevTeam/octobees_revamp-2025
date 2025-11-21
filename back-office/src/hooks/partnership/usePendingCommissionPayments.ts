import { useEffect, useMemo, useState } from "react"

import {
  PENDING_COMMISSION_PAGE_SIZE,
  pendingCommissionPayments,
} from "@/data/partnership/pendingCommissionPayments"

const PAGE_SIZE = PENDING_COMMISSION_PAGE_SIZE

export const usePendingCommissionPayments = () => {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(pendingCommissionPayments.length / PAGE_SIZE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const payments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return pendingCommissionPayments.slice(start, start + PAGE_SIZE)
  }, [page])

  return {
    payments,
    page,
    setPage,
    totalPages,
    totalData: pendingCommissionPayments.length,
    pageSize: PAGE_SIZE,
  }
}
