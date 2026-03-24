"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { getCurrentUser, AuthResponse } from "@/services/authService";
import { useRouter } from "next/navigation";
import { getOrders } from "@/services/orderService";

interface DashboardLayoutProps {
    children: React.ReactNode;
    role?: "admin" | "distributor";
}

export default function DashboardLayout({
    children,
    role: propRole,
}: DashboardLayoutProps) {
    const [user, setUser] = React.useState<AuthResponse | null>(null);
    const [pendingCount, setPendingCount] = React.useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            router.push("/login");
        } else {
            setUser(currentUser);
        }

        const fetchPendingOrders = async () => {
            try {
                const orders = await getOrders();
                setPendingCount(orders.filter(o => o.status === "pending").length);
            } catch (err) {
                console.error("Layout failed to fetch orders:", err);
            }
        };
        fetchPendingOrders();
    }, [router]);

    if (!user) return null;

    const displayRole = (propRole || user.role) as "admin" | "distributor";

    return (
        <div className="flex bg-background-alt font-sans">
            {/* Fixed Sidebar */}
            <Sidebar role={displayRole} pendingOrdersCount={pendingCount} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Main Content Area */}
            <main className="ml-0 lg:ml-64 w-full flex min-h-screen flex-1 flex-col transition-all">
                {/* Sticky Header */}
                <Header 
                    userName={user.name} 
                    role={displayRole} 
                    avatar={user.avatar}
                    onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                />

                {/* Page Content */}
                <div className="flex-1 p-3 sm:p-6 lg:p-8 overflow-x-hidden w-full">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </div>
            </main>
            <AIAssistant />
        </div>
    );
}
