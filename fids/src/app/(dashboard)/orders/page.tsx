"use client";

import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, MapPin, Calendar, Check, X, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

import { getOrders, updateOrderStatus, Order as APIOrder } from "@/services/orderService";
import { getCurrentUser, AuthResponse } from "@/services/authService";

export default function OrdersPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = React.useState("pending");
    const [orders, setOrders] = React.useState<APIOrder[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<AuthResponse | null>(null);
    const [selectedOrder, setSelectedOrder] = React.useState<APIOrder | null>(null);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const data = await getOrders();
            setOrders(data);
            setError(null);
        } catch (err: unknown) {
            console.error("Failed to fetch orders:", err);
            setError("Could not load orders. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const statusParam = params.get("status");
        if (statusParam) {
            setActiveTab(statusParam);
        }
        
        setUser(getCurrentUser());
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateOrderStatus(id, newStatus);
            fetchOrders();
            setIsDetailOpen(false);
            setIsRejectModalOpen(false);
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const tabs = [
        { id: "all", label: t('all') },
        { id: "pending", label: t('pending'), count: orders.filter(o => o.status === "pending").length },
        { id: "approved", label: t('approved') },
        { id: "delivery", label: t('delivery') },
        { id: "delivered", label: t('delivered') },
        { id: "rejected", label: t('rejected') },
    ];

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === "all" || order.status === activeTab;
        const matchesSearch =
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleViewDetails = (order: APIOrder) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">{t('orders_management')}</h1>
                        <p className="text-text-secondary text-sm sm:text-base">{t('orders_description')}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative whitespace-nowrap px-4 sm:px-6 py-4 text-sm font-semibold transition-all",
                                activeTab === tab.id
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-text-secondary hover:text-text-primary"
                            )}
                        >
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className={cn(
                                    "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold shadow-sm",
                                    activeTab === tab.id ? "bg-primary text-white" : "bg-status-pending text-white"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                        <div className="flex-1">
                            <Input
                                placeholder={t('search_orders')}
                                icon={<Search size={18} />}
                                className="h-10 border-none bg-background-alt"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex-1 sm:flex-none flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-text-secondary">
                                <MapPin size={16} />
                                <select className="bg-transparent text-sm font-medium outline-none h-10 w-full sm:w-32 cursor-pointer">
                                    <option>{t('all_countries')}</option>
                                    <option>Burkina Faso</option>
                                    <option>Sénégal</option>
                                    <option>Côte d'Ivoire</option>
                                    <option>Mali</option>
                                </select>
                            </div>
                            <div className="flex-1 sm:flex-none flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-text-secondary whitespace-nowrap">
                                <Calendar size={16} />
                                <span className="text-sm font-medium">{t('all_time')}</span>
                            </div>
                            <Button 
                                variant="outline" 
                                className={cn(
                                    "flex-1 sm:flex-none border-gray-200 h-10 px-4 transition-all",
                                    showAdvancedFilters ? "bg-primary text-white border-primary" : "text-text-secondary"
                                )}
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            >
                                {t('more_filters')}
                            </Button>
                        </div>
                    </div>

                    {showAdvancedFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl shadow-sm ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                             <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Price Range (FCFA)</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" placeholder="Min" className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                                    <span className="text-gray-400">-</span>
                                    <input type="number" placeholder="Max" className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Order Priority</label>
                                <select className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-1 focus:ring-primary">
                                    <option>All Priorities</option>
                                    <option>High</option>
                                    <option>Standard</option>
                                    <option>Low</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Sort Orders</label>
                                <select className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-1 focus:ring-primary">
                                    <option>Newest First</option>
                                    <option>Oldest First</option>
                                    <option>Quantity: High to Low</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Orders Table */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <p className="animate-pulse text-text-secondary">Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="flex h-64 items-center justify-center text-status-rejected">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <Table
                            columns={[
                                {
                                    header: t('order_id'),
                                    accessor: (item: APIOrder) => (
                                        <span className="font-mono font-medium text-xs text-primary">
                                            #{item._id.slice(-8).toUpperCase()}
                                        </span>
                                    )
                                },
                                {
                                    header: t('farmer'),
                                    accessor: (item: APIOrder) => (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20 shadow-sm">
                                                {item.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-text-primary">{item.user.name}</p>
                                                <Badge status="approved" className="mt-0.5 h-4 px-1.5 text-[9px] uppercase tracking-wider">{item.user.country || "Burkina Faso"}</Badge>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    header: t('products'),
                                    accessor: (item: APIOrder) => item.orderItems.map(i => i.name).join(", "),
                                    className: "max-w-[200px] truncate",
                                    hiddenOnMobile: true
                                },
                                {
                                    header: t('quantity'),
                                    accessor: (item: APIOrder) => item.orderItems.reduce((acc, i) => acc + i.qty, 0).toString(),
                                    className: "text-text-secondary font-medium",
                                    hiddenOnMobile: true
                                },
                                {
                                    header: t('date'),
                                    accessor: (item: APIOrder) => new Date(item.createdAt).toLocaleDateString(),
                                    className: "text-text-secondary",
                                    hiddenOnMobile: true
                                },
                                {
                                    header: t('status'),
                                    accessor: (item: APIOrder) => <Badge status={item.status}>{t(item.status)}</Badge>
                                },
                                {
                                    header: t('actions'),
                                    accessor: (item: APIOrder) => (
                                        <div className="flex items-center gap-2">
                                            {item.status === "pending" && user?.role === 'admin' ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-lg"
                                                        onClick={() => handleStatusUpdate(item._id, "approved")}
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-lg"
                                                        onClick={() => {
                                                            setSelectedOrder(item);
                                                            setIsRejectModalOpen(true);
                                                        }}
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button variant="ghost" size="sm" className="h-8 gap-2 px-3" onClick={() => handleViewDetails(item)}>
                                                    <Eye size={16} />
                                                    {t('view')}
                                                </Button>
                                            )}
                                        </div>
                                    )
                                },
                            ]}
                            data={filteredOrders}
                        />
                    )}
                </div>

                {/* Order Details Sliding Panel (Mocked as Modal here) */}
                <Modal
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    title={`${t('order_details')} #${selectedOrder?._id?.slice(-8).toUpperCase()}`}
                    className="max-w-2xl"
                >
                    {selectedOrder && (
                        <div className="space-y-6 flex flex-col">
                            <div className="flex items-start justify-between rounded-xl bg-background-alt p-6 border border-gray-100 shadow-sm">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white font-bold shadow-lg">
                                        {selectedOrder.user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-text-primary">{selectedOrder.user?.name || "Unknown User"}</h3>
                                        <div className="mt-1 flex items-center gap-3 text-sm text-text-secondary">
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {selectedOrder.user?.country || "Burkina Faso"}</span>
                                            <span className="flex items-center gap-1 font-mono">#{selectedOrder._id?.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge status={selectedOrder.status as "pending" | "approved" | "rejected" | "delivery" | "delivered"} className="text-xs px-3 py-1 shadow-sm uppercase tracking-wider">{t(selectedOrder.status)}</Badge>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                                    <span className="h-1 w-4 bg-primary rounded-full" /> {t('requested_items')}
                                </h4>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems.map((item, i: number) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-all hover:bg-background-alt">
                                            <p className="font-semibold text-text-primary">{item.name}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-text-primary">{item.qty}</p>
                                                </div>
                                                <Input
                                                    defaultValue={item.qty.toString()}
                                                    className="w-24 h-9 bg-white font-bold text-center border-gray-200"
                                                    disabled={user?.role !== 'admin'}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {user?.role === 'admin' && (
                                <div className="flex gap-3 pt-6 border-t border-gray-100">
                                    <Button
                                        className="flex-1 py-6 text-lg font-bold gap-2 shadow-lg shadow-primary/20"
                                        onClick={() => handleStatusUpdate(selectedOrder._id, "approved")}
                                    >
                                        <Check size={20} /> {t('approve_order')}
                                    </Button>
                                    <Button variant="danger" className="flex-1 py-6 text-lg font-bold gap-2 shadow-lg shadow-status-rejected/20" onClick={() => setIsRejectModalOpen(true)}>
                                        <X size={20} /> {t('reject_order')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>

                {/* Reject Modal */}
                <Modal
                    isOpen={isRejectModalOpen}
                    onClose={() => setIsRejectModalOpen(false)}
                    title={t('reject_order')}
                    className="max-w-md"
                >
                    <div className="space-y-4 py-2">
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {t('reject_reason_pill')}
                        </p>
                        <textarea
                            className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-background-alt p-4 text-sm outline-none ring-primary focus:ring-1 focus:bg-white transition-all shadow-inner"
                            placeholder={t('reject_reason_placeholder')}
                            required
                        />
                        <div className="flex flex-col gap-2 pt-4">
                            <Button variant="danger" onClick={() => selectedOrder && handleStatusUpdate(selectedOrder._id, "rejected")}>
                                {t('confirm_rejection')}
                            </Button>
                            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
                                {t('cancel')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
