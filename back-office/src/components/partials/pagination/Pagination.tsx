import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type PaginationProps = {
handlePrev: () => void;
    handleNext: () => void;
    setPage: (page: number) => void;
    page: number;
    totalPage: number;
    totalData: number;
}

export default function PaginationComponents({
    handlePrev,
    handleNext,
    page,
    setPage,
    totalPage,
    totalData
}: PaginationProps) {
    return (
        <div className="w-full flex items-end flex-col gap-2">
            <Pagination className="w-full justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={page <= 1 ? undefined : handlePrev}
                            aria-disabled={page <= 1}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPage }, (_, i) => i + 1).slice(0, 3).map((num) => (
                        <PaginationItem key={num}>
                            <PaginationLink onClick={() => setPage(num)} isActive={page === num}>
                                {num}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {totalPage > 3 && <PaginationEllipsis />}
                    <PaginationItem>
                        <PaginationNext
                            onClick={page >= totalPage ? undefined : handleNext}
                            aria-disabled={page >= totalPage}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <div className="w-full flex justify-between items-center text-gray-600">
            <p className="text-sm mt-2">Total Data : {totalData} </p>
            <p className="text-sm mt-2">Page {page} of {totalPage}</p>
            </div>
        </div>
    );
}
