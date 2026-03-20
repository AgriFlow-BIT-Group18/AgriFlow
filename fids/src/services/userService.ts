import api from './api';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'farmer' | 'admin' | 'distributor';
    country?: string;
    phone?: string;
    status: 'active' | 'inactive';
    lastSeen?: string;
    createdAt: string;
    [key: string]: string | number | boolean | null | undefined | object;
}

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
};

export const updateUserStatus = async (id: string, status: string): Promise<User> => {
    const response = await api.put(`/users/${id}/status`, { status });
    return response.data;
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};
