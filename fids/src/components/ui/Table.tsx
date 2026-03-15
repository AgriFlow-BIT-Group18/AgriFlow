import * as React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    sortable?: boolean;
    className?: string;
    hiddenOnMobile?: boolean;
}

export interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    onSort?: (column: keyof T, direction: "asc" | "desc") => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    emptyState?: React.ReactNode;
    isLoading?: boolean;
}

const Table = <T extends Record<string, unknown>>({
    columns,
    data,
    onSort,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    emptyState,
    isLoading,
}: TableProps<T>) => {
    const [sortConfig, setSortConfig] = React.useState<{
        key: keyof T;
        direction: "asc" | "desc";
    } | null>(null);

    const handleSort = (column: Column<T>) => {
        if (!column.sortable || typeof column.accessor !== "string") return;

        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === column.accessor && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const key = column.accessor as keyof T;
        setSortConfig({ key, direction });
        onSort?.(key, direction);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-background-alt border-b border-gray-200">
                            {columns.map((column, idx) => (
                                <th
                                    key={idx}
                                    onClick={() => handleSort(column)}
                                    className={cn(
                                        "px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary select-none",
                                        column.sortable && "cursor-pointer hover:text-primary transition-colors",
                                        column.hiddenOnMobile && "hidden md:table-cell",
                                        column.className
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.header}
                                        {column.sortable && sortConfig?.key === column.accessor && (
                                            <span className="text-primary">
                                                {sortConfig.direction === "asc" ? (
                                                    <ChevronUp size={14} />
                                                ) : (
                                                    <ChevronDown size={14} />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-text-secondary"
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        Loading data...
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    {emptyState || (
                                        <div className="text-text-secondary">No data found</div>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIdx) => (
                                <tr
                                    key={rowIdx}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    {columns.map((column, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={cn(
                                                "px-6 py-4 text-sm text-text-primary whitespace-nowrap",
                                                column.hiddenOnMobile && "hidden md:table-cell",
                                                column.className
                                            )}
                                        >
                                            {typeof column.accessor === "function"
                                                ? column.accessor(item)
                                                : (item[column.accessor as string] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <p className="text-sm text-text-secondary">
                        Page <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange?.(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md border border-gray-200 bg-white text-text-secondary hover:bg-background-alt disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => onPageChange?.(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md border border-gray-200 bg-white text-text-secondary hover:bg-background-alt disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { Table };
