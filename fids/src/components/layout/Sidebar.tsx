"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Box,
    ClipboardList,
    Truck,
    BarChart3,
    Users,
    Settings,
    LogOut,
    Leaf,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/services/authService";

export interface SidebarProps {
    role: "admin" | "distributor";
    pendingOrdersCount?: number;
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, pendingOrdersCount = 0, isOpen = false, onClose }) => {
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "distributor"] },
        { name: "Inventory", href: "/inventory", icon: Box, roles: ["admin", "distributor"] },
        { name: "Orders", href: "/orders", icon: ClipboardList, roles: ["admin", "distributor"], badge: pendingOrdersCount },
        { name: "Deliveries", href: "/deliveries", icon: Truck, roles: ["admin", "distributor"] },
        { name: "AgroFlow AI", href: "/ai", icon: Sparkles, roles: ["admin", "distributor"] },
        { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin", "distributor"] },
        { name: "Users", href: "/users", icon: Users, roles: ["admin", "distributor"] },
    ];

    const normalizedRole = role.toLowerCase();
    const filteredNavItems = navItems.filter((item) => item.roles.includes(normalizedRole));

    return (
        <>
            {/* Backdrop overlay for mobile screens */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden transition-all" 
                    onClick={onClose}
                />
            )}
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-sidebar text-white shadow-xl transition-transform duration-300",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
            <div className="flex items-center gap-3 px-6 py-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shadow-lg">
                    <Leaf className="text-sidebar fill-current" size={24} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-tight">AgroFlow</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
                {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-white shadow-md shadow-black/10"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon
                                    size={20}
                                    className={cn(
                                        "transition-colors",
                                        isActive ? "text-white" : "text-gray-400 group-hover:text-secondary"
                                    )}
                                />
                                {item.name}
                            </div>
                            {item.badge !== undefined && item.badge > 0 && (
                                <span
                                    className={cn(
                                        "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow-sm",
                                        isActive ? "bg-white text-primary" : "bg-status-pending text-white"
                                    )}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-white/10 px-4 py-6 space-y-1">
                <Link
                    href="/settings"
                    className={cn(
                        "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                        pathname === "/settings"
                            ? "bg-primary text-white"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Settings size={20} className="text-gray-400 group-hover:text-secondary" />
                    Settings
                </Link>
                <button
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-300 hover:bg-status-rejected/10 hover:text-status-rejected transition-all"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
        </>
    );
};

export { Sidebar };
