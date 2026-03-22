import api from './api';

export interface KPI {
    label: string;
    value: string;
    sub: string;
    trend: string;
    positive: boolean;
}

export interface CountryStat {
    name: string;
    value: string;
    pct: number;
}

export interface Transaction {
    [key: string]: any;
    id: string;
    farmer: string;
    country: string;
    amount: string;
    date: string;
    status: string;
}

export interface AnalyticsData {
    kpis: KPI[];
    countryPerformance: CountryStat[];
    monthlyTrend: number[];
    recentTransactions: Transaction[];
}

export const getDashboardStats = async (): Promise<AnalyticsData> => {
    const response = await api.get('/analytics');
    return response.data;
};

export const exportAnalytics = async () => {
    const response = await api.get('/analytics/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'distribution_report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
};
