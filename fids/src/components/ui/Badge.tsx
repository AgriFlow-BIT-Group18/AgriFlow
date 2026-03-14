import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    status?: "pending" | "approved" | "delivery" | "delivered" | "rejected";
}

const Badge = ({ className, status = "pending", ...props }: BadgeProps) => {
    const statusClasses = {
        pending: "bg-status-pending text-white",
        approved: "bg-status-approved text-white",
        delivery: "bg-status-delivery text-white",
        delivered: "bg-status-delivered text-white",
        rejected: "bg-status-rejected text-white",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                statusClasses[status],
                className
            )}
            {...props}
        />
    );
};

export { Badge };
