"use client"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationComponents({
    handlePrev,
    handleNext,
    page,
    setPage,
    totalPage,
    className
}: {
    handlePrev: () => void;
    handleNext: () => void;
    setPage: (page: number) => void;
    page: number;
    totalPage: number;
    className?: string;
}) {
    const renderPages = () => {
        const pages = [];

        const startPage = Math.max(1, page - 1);
        const endPage = Math.min(totalPage, page + 1);

        // First Page + Ellipsis
        if (startPage > 1) {
            pages.push(
                <PaginationItem key={1} className="hidden sm:block">
                    <PaginationLink
                        onClick={() => setPage(1)}
                        className="cursor-pointer hover:bg-red-700/10"
                        isActive={page === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            if (startPage > 2) {
                pages.push(<PaginationEllipsis key="start-ellipsis" />);
            }
        }

        // Middle Pages (Current ±1)
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        onClick={() => setPage(i)}
                        className="cursor-pointer hover:bg-red-700/10"
                        isActive={page === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Last Page + Ellipsis
        if (endPage < totalPage) {
            if (endPage < totalPage - 1) {
                pages.push(<PaginationEllipsis key="end-ellipsis" />);
            }

            pages.push(
                <PaginationItem key={totalPage} className="hidden sm:block">
                    <PaginationLink
                        onClick={() => setPage(totalPage)}
                        className="cursor-pointer hover:bg-red-700/10"
                        isActive={page === totalPage}
                    >
                        {totalPage}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pages;
    };

    return (
        <div className={`w-full flex items-center justify-center flex-wrap gap-2 ${className} ${totalPage <= 1 && 'hidden'}`}>
            <Pagination className="w-full justify-center">
                <PaginationContent>
                    {/* Previous Button */}
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={page > 1 ? handlePrev : undefined}
                            aria-disabled={page <= 1}
                        />
                    </PaginationItem>

                    {/* Page Items */}
                    {renderPages()}

                    {/* Next Button */}
                    <PaginationItem>
                        <PaginationNext
                            onClick={page < totalPage ? handleNext : undefined}
                            aria-disabled={page >= totalPage}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
