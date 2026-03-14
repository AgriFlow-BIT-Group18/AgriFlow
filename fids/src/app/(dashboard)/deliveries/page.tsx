"use client";

import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Truck, MapPin, User, Package, Search, Filter, Plus, ChevronRight, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

import { getDeliveries, createDelivery, updateDeliveryStatus, Delivery } from "@/services/deliveryService";
import { getOrders, Order } from "@/services/orderService";
import { getCurrentUser, AuthResponse } from "@/services/authService";

export default function DeliveriesPage() {
    const [deliveries, setDeliveries] = React.useState<Delivery[]>([]);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState<AuthResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Form state
    const [selectedOrderId, setSelectedOrderId] = React.useState("");
    const [driverName, setDriverName] = React.useState("");
    const [driverPhone, setDriverPhone] = React.useState("");

    const fetchDeliveries = async () => {
        try {
            setIsLoading(true);
            const [delData, ordData] = await Promise.all([getDeliveries(), getOrders()]);
            setDeliveries(delData);
            setOrders(ordData.filter(o => o.status === "approved"));
        } catch (err) {
            console.error("Failed to fetch deliveries:", err);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setUser(getCurrentUser());
        fetchDeliveries();
    }, []);

    const handleCreateDelivery = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createDelivery({
                order: selectedOrderId,
                driverName,
                driverPhone,
            });
            setIsModalOpen(false);
            fetchDeliveries();
        } catch (err) {
            console.error("Failed to create delivery:", err);
        }
    };

    const PIPELINE = [
        { label: "Ready", icon: Package, count: orders.length, color: "bg-blue-50 text-blue-600 border-blue-100" },
        { label: "Shipped", icon: Truck, count: deliveries.filter(d => d.status === 'assigned').length, color: "bg-orange-50 text-orange-600 border-orange-100" },
        { label: "En Route", icon: MapPin, count: deliveries.filter(d => d.status === 'in_transit').length, color: "bg-amber-50 text-amber-600 border-amber-100" },
        { label: "Delivered", icon: CheckCircle2, count: deliveries.filter(d => d.status === 'delivered').length, color: "bg-green-50 text-green-600 border-green-100" },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Deliveries Tracking</h1>
                        <p className="text-text-secondary text-sm sm:text-base">Monitor shipments and coordinate logistics in real-time.</p>
                    </div>
                    {user?.role === 'admin' && (
                        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20">
                            <Plus size={18} />
                            Schedule Delivery
                        </Button>
                    )}
                </div>

                {/* Status Pipeline Visualization */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {PIPELINE.map((stage, idx) => (
                        <div key={idx} className={cn(
                            "flex flex-col gap-3 rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md",
                            stage.color
                        )}>
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-white/50 p-2 shadow-inner">
                                    <stage.icon size={28} />
                                </div>
                                <span className="text-3xl font-extrabold tracking-tighter">{stage.count}</span>
                            </div>
                            <p className="font-bold uppercase tracking-widest text-[10px] opacity-80">{stage.label}</p>
                        </div>
                    ))}
                </div>

                {/* Delivery Cards Grid */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {isLoading ? (
                         <div className="col-span-full py-20 text-center text-text-secondary">Loading deliveries...</div>
                    ) : deliveries.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-text-secondary bg-white rounded-2xl ring-1 ring-black/5">No active deliveries.</div>
                    ) : deliveries.map((delivery) => (
                        <div key={delivery._id} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md">
                            <div className="flex items-start justify-between border-b border-gray-50 pb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-primary">{delivery._id.substring(0, 8)}</span>
                                        <Badge status={delivery.status === 'in_transit' ? 'delivery' : delivery.status as any} className="text-[10px] uppercase">{delivery.status}</Badge>
                                    </div>
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                                        {typeof delivery.order !== 'string' ? delivery.order.shippingAddress?.address || 'Unknown location' : 'Loading...'}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary leading-none">Status</p>
                                    <p className="mt-1 text-sm font-bold text-text-primary capitalize">{delivery.status.replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 rounded-xl bg-background-alt p-4 border border-gray-100 mt-6">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">Driver</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                                        <User size={14} className="text-primary" /> {delivery.driverName}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">Phone</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                                        <Phone size={14} className="text-primary" /> {delivery.driverPhone}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-text-secondary">Order</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                                        <Package size={14} /> {typeof delivery.order !== 'string' ? delivery.order._id.substring(0, 8) : '...'}
                                    </div>
                                </div>
                            </div>

                            {user?.role === 'admin' && (
                                <div className="mt-6 flex gap-2">
                                    <Button 
                                        onClick={async () => {
                                            const nextStatus = delivery.status === 'assigned' ? 'in_transit' : 'delivered';
                                            await updateDeliveryStatus(delivery._id, nextStatus);
                                            fetchDeliveries();
                                        }}
                                        disabled={delivery.status === 'delivered'}
                                        className="flex-1 h-10 font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                                    >
                                        {delivery.status === 'assigned' ? 'Start Delivery' : delivery.status === 'in_transit' ? 'Mark Delivered' : 'Completed'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Schedule New Delivery"
                >
                    <form onSubmit={handleCreateDelivery} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-text-primary">Select Order*</label>
                            <select
                                required
                                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                value={selectedOrderId}
                                onChange={(e) => setSelectedOrderId(e.target.value)}
                            >
                                <option value="">Select an approved order</option>
                                {orders.map(order => (
                                    <option key={order._id} value={order._id}>
                                        Order #{order._id.substring(0, 8)} - {order.user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            label="Driver Name*"
                            placeholder="e.g. Cheikh Ndiaye"
                            required
                            icon={<User size={16} />}
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                        />
                        <Input
                            label="Driver Phone*"
                            placeholder="+221 ..."
                            required
                            icon={<Phone size={16} />}
                            value={driverPhone}
                            onChange={(e) => setDriverPhone(e.target.value)}
                        />
                        <div className="flex flex-col gap-2 pt-4">
                            <Button type="submit" className="font-bold py-6 text-lg shadow-lg shadow-primary/20">
                                Create Delivery
                            </Button>
                            <Button type="button" variant="ghost" className="font-bold" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
