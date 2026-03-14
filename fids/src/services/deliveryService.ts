import api from './api';
import { Order } from './orderService';

export interface Delivery {
    _id: string;
    order: string | Order;
    driverName: string;
    driverPhone: string;
    status: 'assigned' | 'in_transit' | 'delivered' | 'failed';
    currentLocation?: string;
    estimatedDeliveryTime?: string;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}

export const getDeliveries = async (): Promise<Delivery[]> => {
    const response = await api.get('/deliveries');
    return response.data;
};

export const createDelivery = async (deliveryData: Partial<Delivery>): Promise<Delivery> => {
    const response = await api.post('/deliveries', deliveryData);
    return response.data;
};

export const updateDeliveryStatus = async (id: string, status: string, currentLocation?: string): Promise<Delivery> => {
    const response = await api.put(`/deliveries/${id}/status`, { status, currentLocation });
    return response.data;
};
