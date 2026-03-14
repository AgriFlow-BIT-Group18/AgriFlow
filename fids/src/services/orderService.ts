import api from './api';

export interface OrderItem {
    name: string;
    qty: number;
    image?: string;
    price: number;
    product: string;
}

export interface Order {
    _id: string;
    user: {
        _id: string;
        name: string;
        region?: string;
    };
    orderItems: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    totalPrice: number;
    status: 'pending' | 'approved' | 'delivery' | 'delivered' | 'rejected';
    isPaid: boolean;
    createdAt: string;
    updatedAt: string;
    [key: string]: string | number | boolean | null | undefined | object;
}

export const getOrders = async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
};
