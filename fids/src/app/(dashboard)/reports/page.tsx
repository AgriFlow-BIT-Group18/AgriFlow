"use client";

import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, Users, Package, Download, Calendar, Filter, ArrowUp, ArrowDown, Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

import { getDashboardStats, AnalyticsData, KPI, RegionalStat, exportAnalytics } from "@/services/analyticsService";
import { Table } from "@/components/ui/Table";

export default function ReportsPage() {
    const [data, setData] = React.useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const stats = await getDashboardStats();
            
            // If no regional data from API, ensure we show some Burkina Faso placeholders
            const bfRegions = [
                { name: "Ouagadougou", value: "0kg", pct: 0 },
                { name: "Bobo-Dioulasso", value: "0kg", pct: 0 },
                { name: "Koudougou", value: "0kg", pct: 0 },
                { name: "Banfora", value: "0kg", pct: 0 },
            ];

            const combinedRegions = stats.regionalPerformance.length > 0 
                ? stats.regionalPerformance 
                : bfRegions;

            setData({
                ...stats,
                regionalPerformance: combinedRegions
            });
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchStats();
    }, []);

    const handleExport = async () => {
        try {
            await exportAnalytics();
        } catch (err) {
            console.error("Export failed:", err);
        }
    };

    if (isLoading || !data) {
        return (
            <DashboardLayout>
                <div className="flex h-[80vh] items-center justify-center">
                    <p className="text-text-secondary animate-pulse text-lg font-bold">Initializing Analytics Engine...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Reports & Analytics</h1>
                        <p className="text-text-secondary">Real-time auditing of agricultural distribution in Burkina Faso.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 h-11 text-text-secondary shadow-sm">
                            <Calendar size={18} />
                            <span className="text-sm font-semibold">Live System Audit</span>
                        </div>
                        <Button onClick={handleExport} className="h-11 shadow-lg shadow-primary/20 gap-2 font-bold">
                            <Download size={18} />
                            Export CSV Report
                        </Button>
                    </div>
                </div>

                {/* KPI Row - Detailed Breakdown */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {data.kpis.map((kpi, idx) => (
                        <div key={idx} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md border-l-4 border-primary">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-primary/10 p-2 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <BarChart3 size={24} />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-bold",
                                    kpi.positive ? "text-green-600" : "text-status-rejected"
                                )}>
                                    {kpi.positive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                    {kpi.trend}
                                </div>
                            </div>
                            <div className="mt-6">
                                <p className="text-3xl font-extrabold text-text-primary tabular-nums tracking-tighter">{kpi.value}</p>
                                <div className="mt-1 flex items-center justify-between">
                                    <p className="text-sm font-bold text-text-primary">{kpi.label}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">{kpi.sub}</p>
                                </div>
                                <p className="mt-3 text-[10px] text-text-secondary leading-relaxed opacity-70">
                                    {kpi.label === "Total Distributions" && "Sum of all confirmed seed and fertilizer quantities distributed across all regions."}
                                    {kpi.label === "Approval Rate" && "Percentage of farmer requests that have been successfully verified and approved."}
                                    {kpi.label === "Processing Time" && "Average time from request submission to final delivery assignment."}
                                    {kpi.label === "Active Farmers" && "Number of farmers registered and active on the mobile platform."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Distributions Trend */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 flex flex-col h-full">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">Monthly Distributions</h3>
                                <p className="text-xs text-text-secondary">Aggregated volume history (kg)</p>
                            </div>
                        </div>
                        {/* Bar Chart */}
                        <div className="mt-auto flex h-72 items-end gap-3 px-4 pb-8 border-b border-gray-100">
                            {data.monthlyTrend.map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group relative">
                                    <div 
                                        className="w-full rounded-t bg-primary transition-all hover:bg-primary-dark cursor-pointer group-hover:shadow-lg" 
                                        style={{ height: `${Math.max(2, (val / (Math.max(...data.monthlyTrend) || 1)) * 100)}%` }} 
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-10">
                                            {val.toLocaleString()} kg
                                        </div>
                                    </div>
                                    <span className="absolute -bottom-7 text-[10px] font-bold text-text-secondary opacity-50">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Regional Breakdown */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 h-full">
                        <h3 className="mb-8 text-lg font-bold text-text-primary">Country Performance (International)</h3>
                        <div className="space-y-6">
                            {data.regionalPerformance.map((reg, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="text-text-primary">{reg.name}</span>
                                        <span className="text-primary tabular-nums">{reg.value}</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-background-alt overflow-hidden">
                                        <div className={cn("h-full rounded-full bg-primary transition-all duration-1000 delay-200")} style={{ width: `${reg.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Transactions List - Live Distribution Stream */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-background-alt/30">
                        <div className="flex items-center gap-2">
                            <Leaf className="text-primary" size={20} />
                            <h3 className="text-lg font-bold text-text-primary">Live Distribution Stream</h3>
                        </div>
                        <Button onClick={fetchStats} variant="ghost" size="sm" className="gap-2 h-9 text-primary font-bold hover:bg-primary/5">
                            <TrendingUp size={14} /> Refresh Live Feed
                        </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <Table
                            columns={[
                                { header: "ID", accessor: (tx: any) => <span className="font-mono text-xs text-primary font-bold">{tx.id.substring(0, 8)}</span>, hiddenOnMobile: true },
                                { header: "Date", accessor: (tx: any) => new Date(tx.date).toLocaleDateString() + ' ' + new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), hiddenOnMobile: true },
                                { header: "Farmer", accessor: (tx: any) => <span className="font-bold">{tx.farmer}</span> },
                                { header: "Country", accessor: (tx: any) => tx.region, hiddenOnMobile: true },
                                { header: "Amount", accessor: (tx: any) => <span className="font-bold text-primary">{tx.amount}</span> },
                                { 
                                    header: "Status", 
                                    accessor: (tx: any) => (
                                        <Badge status={tx.status as any} className="text-[10px] uppercase font-bold">
                                            {tx.status}
                                        </Badge>
                                    ) 
                                },
                            ]}
                            data={data.recentTransactions}
                        />

                        {data.recentTransactions.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <Package className="text-gray-300" size={48} />
                                <p className="text-text-secondary font-medium tracking-tight">System ready. Awaiting next successful distribution event.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
