"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Table } from "@tanstack/react-table";

interface Props<TData> {
  table: Table<TData>;
}

function getPageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages = new Set<number>();
  pages.add(0);
  pages.add(total - 1);
  for (let d = -1; d <= 1; d++) {
    const p = current + d;
    if (p >= 0 && p < total) pages.add(p);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "…")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }

  return result;
}

export default function TablePagination<TData>({ table }: Props<TData>) {
  const current = table.getState().pagination.pageIndex;
  const total = table.getPageCount();

  if (total <= 1) return null;

  const window = getPageWindow(current, total);

  return (
    <div className="p-6 border-t border-gray-100 flex justify-center">
      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="size-8 rounded-full border border-orange-200 flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {window.map((entry, i) =>
          entry === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={entry}
              onClick={() => table.setPageIndex(entry)}
              className={`size-8 rounded-full text-xs font-medium flex items-center justify-center transition-colors ${
                entry === current
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {String(entry + 1).padStart(2, "0")}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="size-8 rounded-full border border-orange-200 flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
