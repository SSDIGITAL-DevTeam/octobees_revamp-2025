'use client'

import PaginationComponents from '@/components/partials/Pagination/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'

export default function InsightPagination({
  page,
  totalPage
}: {
  page: number
  totalPage: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`?${params.toString()}`)
  }

  const handleNext = () => {
    if (page < totalPage) {
      handleChangePage(page + 1)
    }
  }

  const handlePrevious = () => {
    if (page > 1) {
      handleChangePage(page - 1)
    }
  }

  return (
    <PaginationComponents
      handleNext={handleNext}
      handlePrev={handlePrevious}
      setPage={handleChangePage}
      page={page}
      totalPage={totalPage}
    />
  )
}
