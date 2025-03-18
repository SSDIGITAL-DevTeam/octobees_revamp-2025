import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationComponents({
    handlePrev,
    handleNext,
    page,
    setPage,
    totalPage,
}: {
    handlePrev: () => void;
    handleNext: () => void;
    setPage: (page: number) => void;
    page: number;
    totalPage: number;
}) {
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
            <p className="text-sm mt-2">Total Page: {totalPage}</p>
        </div>
    );
}
