"use client";
import { Meta } from "@/lib/types";

interface PaginationControlsProps {
  meta: Meta;
  onPageChange: (newPage: number) => void;
}

export default function PaginationControls({ meta, onPageChange }: PaginationControlsProps) {
  return (
    <nav className="mt-8 flex items-center justify-center gap-4" role="navigation" aria-label="Pagination">
      <button
        onClick={() => onPageChange(meta.currentPage - 1)}
        disabled={meta.isFirstPage}
        className="cursor-pointer rounded-md bg-aurora-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-aurora-blue/80 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-shako-off-white/80">
        Page {meta.currentPage} of {meta.pageCount}
      </span>
      <button
        onClick={() => onPageChange(meta.currentPage + 1)}
        disabled={meta.isLastPage}
        className="cursor-pointer rounded-md bg-aurora-blue px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-aurora-blue/80 disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
