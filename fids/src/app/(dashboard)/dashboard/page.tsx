"use client";

import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    TrendingUp,
    AlertTriangle,
    Clock,
    Truck,
    ArrowUpRight,
    ChevronRight,
    MoreVertical
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { cn } from "@/lib/utils";

import { getOrders, Order as APIOrder } from "@/services/orderService";
import { getProducts, Product as APIProduct } from "@/services/productService";

export default function AdminDashboardPage() {
    const [orders, setOrders] = React.useState<APIOrder[]>([]);
    const [products, setProducts] = React.useState<APIProduct[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [ordersData, productsData] = await Promise.all([
                getOrders(),
                getProducts()
            ]);
            setOrders(ordersData);
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const lowStockCount = products.filter(p => p.stockQuantity < p.minThreshold).length;
    const pendingOrdersCount = orders.filter(o => o.status === "pending").length;
    const transitOrdersCount = orders.filter(o => o.status === "delivery").length;
    const todayOrdersCount = orders.filter(o => {
        const today = new Date().toDateString();
        return new Date(o.createdAt).toDateString() === today;
    }).length;

    const stats = [
        { label: "Today's Orders", value: todayOrdersCount.toString(), trend: "+12%", icon: TrendingUp, color: "bg-blue-500" },
        { label: "Low Stock Alerts", value: lowStockCount.toString().padStart(2, "0"), trend: "Warning", icon: AlertTriangle, color: "bg-amber-500" },
        { label: "Pending Approvals", value: pendingOrdersCount.toString().padStart(2, "0"), trend: "High", icon: Clock, color: "bg-orange-500" },
        { label: "Deliveries in Transit", value: transitOrdersCount.toString().padStart(2, "0"), trend: "+2 today", icon: Truck, color: "bg-green-500" },
    ];

    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const stockByCategory = products.reduce((acc: Record<string, number>, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});

    const totalProducts = products.length || 1;
    const categoryStats = Object.entries(stockByCategory).map(([label, count]) => ({
        label: label + "s",
        color: label === "Fertilizer" ? "bg-primary" : label === "Seed" ? "bg-blue-500" : "bg-orange-500",
        value: Math.round((count / totalProducts) * 100) + "%"
    }));

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8 flex-1">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
                        <p className="text-text-secondary text-sm sm:text-base">Welcome back, here is what is happening today.</p>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto gap-2">
                        <ArrowUpRight size={18} />
                        Export Data
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg", stat.color)}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                                    <p className="text-2xl font-bold text-text-primary">{isLoading ? "..." : stat.value}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-green-600">
                                <ArrowUpRight size={14} />
                                <span>{stat.trend}</span>
                                <span className="ml-1 font-normal text-text-secondary">vs yesterday</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Section: Charts Placeholders */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Order Activity Chart */}
                    <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-text-primary">Orders Activity</h3>
                            <select className="rounded-md border border-gray-200 bg-background-alt px-3 py-1 text-sm font-medium text-text-secondary outline-none ring-primary focus:ring-1">
                                <option>Last 30 days</option>
                                <option>Last 7 days</option>
                            </select>
                        </div>
                        {/* Chart Simulation */}
                        <div className="relative flex h-64 w-full items-end gap-2 pb-6">
                            {[60, 45, 80, 55, 90, 70, 85, 40, 65, 50, 75, 95].map((h, i) => (
                                <div key={i} className="group relative flex-1">
                                    <div
                                        className="w-full rounded-t bg-primary/20 transition-all group-hover:bg-primary"
                                        style={{ height: `${h}%` }}
                                    />
                                    <div
                                        className="absolute inset-x-0 -bottom-6 text-center text-[10px] text-text-secondary"
                                    >
                                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock Distribution */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                        <h3 className="mb-6 text-lg font-bold text-text-primary">Stock by Category</h3>
                        <div className="flex flex-col items-center justify-center py-4">
                            {/* Circular Chart Placeholder */}
                            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-primary/10">
                                <div className="absolute top-[-16px] left-[-16px] h-40 w-40 rounded-full border-[16px] border-primary border-r-transparent border-b-transparent" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-text-primary">84%</p>
                                    <p className="text-[10px] uppercase font-bold text-text-secondary tracking-widest leading-none">Healthy</p>
                                </div>
                            </div>

                            <div className="mt-8 w-full space-y-3">
                                {categoryStats.length > 0 ? categoryStats.map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-3 w-3 rounded-full", cat.color)} />
                                            <span className="text-sm font-medium text-text-secondary">{cat.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-text-primary">{cat.value}</span>
                                    </div>
                                )) : (
                                    <p className="text-center text-sm text-text-secondary">No products data</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Recent Orders */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h3 className="text-lg font-bold text-text-primary">Recent Orders</h3>
                        <Button variant="ghost" className="text-sm">View All <ChevronRight size={16} className="ml-1" /></Button>
                    </div>
                    {isLoading ? (
                        <div className="flex h-48 items-center justify-center">
                            <p className="animate-pulse text-text-secondary">Updating activity feed...</p>
                        </div>
                    ) : (
                        <Table
                            columns={[
                                {
                                    header: "Order ID",
                                    accessor: (item: APIOrder) => (
                                        <span className="font-mono font-medium text-xs text-primary">
                                            #{item._id.slice(-8).toUpperCase()}
                                        </span>
                                    )
                                },
                                { header: "Farmer Name", accessor: (item: APIOrder) => item.user.name },
                                {
                                    header: "Products",
                                    accessor: (item: APIOrder) => item.orderItems.map(i => i.name).join(", "),
                                    className: "max-w-[150px] truncate"
                                },
                                {
                                    header: "Quantity",
                                    accessor: (item: APIOrder) => item.orderItems.reduce((acc, i) => acc + i.qty, 0).toString()
                                },
                                {
                                    header: "Status",
                                    accessor: (item: APIOrder) => <Badge status={item.status}>{item.status}</Badge>
                                },
                                {
                                    header: "Date",
                                    accessor: (item: APIOrder) => new Date(item.createdAt).toLocaleDateString(),
                                    className: "text-text-secondary"
                                },
                                {
                                    header: "",
                                    accessor: () => (
                                        <button className="rounded-full p-2 text-text-secondary hover:bg-background-alt">
                                            <MoreVertical size={16} />
                                        </button>
                                    )
                                },
                            ]}
                            data={recentOrders}
                        />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
