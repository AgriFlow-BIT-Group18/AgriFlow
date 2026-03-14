"use client";

import * as React from "react";
import { Bell, Search, User, LogOut, ChevronDown, Menu } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { logout } from "@/services/authService";
import { cn } from "@/lib/utils";

export interface HeaderProps {
    userName: string;
    role: "admin" | "distributor";
    notificationCount?: number;
    onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    userName,
    role,
    notificationCount = 0,
    onMenuToggle,
}) => {
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8 shadow-sm">
            <div className="flex w-full md:w-96 max-w-sm items-center gap-3">
                <button 
                    onClick={onMenuToggle}
                    className="lg:hidden rounded-lg p-2 text-text-secondary hover:bg-background-alt transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="relative hidden md:flex w-full items-center">
                    <Search
                        size={18}
                        className="absolute left-3 text-text-secondary pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        className="h-10 w-full rounded-full border border-gray-200 bg-background-alt pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative rounded-full p-2 text-text-secondary hover:bg-background-alt transition-colors">
                    <Bell size={20} />
                    {notificationCount > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-status-rejected text-[10px] font-bold text-white ring-2 ring-white">
                            {notificationCount}
                        </span>
                    )}
                </button>

                <div className="h-8 w-px bg-gray-200" />

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 rounded-lg p-1 transition-all hover:bg-background-alt"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                            {userName.charAt(0)}
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold text-text-primary leading-tight">
                                {userName}
                            </p>
                            <Badge
                                status={role === "admin" ? "approved" : "delivery"}
                                className="mt-0.5 h-4 px-1.5 text-[9px] uppercase tracking-wider"
                            >
                                {role}
                            </Badge>
                        </div>
                        <ChevronDown
                            size={16}
                            className={cn(
                                "text-text-secondary transition-transform",
                                isProfileOpen && "rotate-180"
                            )}
                        />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black/5 z-20">
                                <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background-alt transition-colors">
                                    <User size={16} />
                                    My Profile
                                </button>
                                <button
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-status-rejected hover:bg-status-rejected/5 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header >
    );
};

export { Header };
