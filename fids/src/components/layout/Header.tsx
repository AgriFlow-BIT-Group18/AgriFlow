"use client";

import * as React from "react";
import { Bell, Search, User, LogOut, ChevronDown, Menu } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { logout } from "@/services/authService";
import { getNotifications, getUnreadCount, markAsRead, Notification } from "@/services/notificationService";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";

export interface HeaderProps {
    userName: string;
    role: "admin" | "distributor";
    avatar?: string;
    onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    userName,
    role,
    avatar,
    onMenuToggle,
}) => {
    const { t } = useTranslation();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isSearchVisible, setIsSearchVisible] = React.useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = React.useState(0);

    const fetchNotifications = async () => {
        try {
            const [notifs, countData] = await Promise.all([
                getNotifications(),
                getUnreadCount()
            ]);
            setNotifications(notifs);
            setUnreadCount(countData.count);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    React.useEffect(() => {
        fetchNotifications();
        // Refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8 shadow-sm">
            <div className={cn(
                "flex items-center gap-3 transition-all duration-300",
                isSearchVisible ? "w-full" : "w-auto md:w-96 max-w-sm"
            )}>
                {!isSearchVisible && (
                    <button 
                        onClick={onMenuToggle}
                        className="lg:hidden rounded-lg p-2 text-text-secondary hover:bg-background-alt transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                )}
                
                <div className={cn(
                    "relative items-center transition-all duration-300",
                    isSearchVisible ? "flex w-full" : "hidden md:flex w-full"
                )}>
                    {isSearchVisible && (
                        <button 
                            onClick={() => setIsSearchVisible(false)}
                            className="mr-2 md:hidden rounded-lg p-2 text-text-secondary hover:bg-background-alt"
                        >
                            <ChevronDown className="rotate-90" size={20} />
                        </button>
                    )}
                    <Search
                        size={18}
                        className="absolute left-10 md:left-3 text-text-secondary pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder={t('search_dashboard')}
                        autoFocus={isSearchVisible}
                        className="h-10 w-full rounded-full border border-gray-200 bg-background-alt pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <div className={cn(
                "flex items-center gap-2 sm:gap-6",
                isSearchVisible && "hidden"
            )}>
                <button 
                    onClick={() => setIsSearchVisible(true)}
                    className="md:hidden rounded-full p-2 text-text-secondary hover:bg-background-alt"
                >
                    <Search size={20} />
                </button>
                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={cn(
                            "relative rounded-full p-2 text-text-secondary hover:bg-background-alt transition-colors",
                            isNotificationsOpen && "bg-background-alt text-primary"
                        )}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-status-rejected text-[10px] font-bold text-white ring-2 ring-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsNotificationsOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-20">
                                <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3 bg-white">
                                    <h3 className="font-bold text-text-primary">{t('notifications_title')}</h3>
                                    {unreadCount > 0 && (
                                        <Badge status="pending" className="h-5 px-1.5 text-[10px]">
                                            {unreadCount} {t('pending')}
                                        </Badge>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto bg-white">
                                    {notifications.length === 0 ? (
                                        <div className="py-12 text-center text-text-secondary">
                                            <Bell className="mx-auto mb-2 opacity-20" size={32} />
                                            <p className="text-sm">{t('no_notifications')}</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-50">
                                            {notifications.map((notif) => (
                                                <div 
                                                    key={notif._id} 
                                                    className={cn(
                                                        "group flex gap-3 p-4 transition-colors hover:bg-background-alt",
                                                        !notif.isRead && "bg-primary/5 hover:bg-primary/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                                        notif.type === 'order' ? "bg-blue-100 text-blue-600" : 
                                                        notif.type === 'delivery' ? "bg-orange-100 text-orange-600" : 
                                                        "bg-gray-100 text-gray-600"
                                                    )}>
                                                        <Bell size={14} />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className={cn("text-sm font-bold text-text-primary", !notif.isRead && "text-primary")}>
                                                                {notif.title}
                                                            </p>
                                                            {!notif.isRead && (
                                                                <button 
                                                                    onClick={() => handleMarkAsRead(notif._id)}
                                                                    className="text-[10px] font-bold text-primary hover:underline"
                                                                >
                                                                    {t('mark_as_read')}
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-text-secondary leading-relaxed">
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-[10px] text-text-secondary/60">
                                                            {new Date(notif.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-gray-50 px-4 py-2 bg-gray-50/50">
                                    <button className="w-full py-1 text-center text-[10px] font-bold text-text-secondary hover:text-primary transition-colors uppercase tracking-wider">
                                        {t('view_all')}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-200" />

                <LanguageSelector />

                <div className="h-8 w-px bg-gray-200" />

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 rounded-lg p-1 transition-all hover:bg-background-alt"
                    >
                            {avatar ? (
                                <div className="relative h-9 w-9 overflow-hidden">
                                    <Image 
                                        src={avatar.startsWith('http') ? avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${avatar}`} 
                                        alt={userName} 
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                userName.charAt(0)
                            )}
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
                                    {t('my_profile')}
                                </button>
                                <button
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-status-rejected hover:bg-status-rejected/5 transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    {t('logout')}
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
