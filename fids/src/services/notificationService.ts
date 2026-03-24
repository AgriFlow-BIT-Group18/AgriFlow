import api from "./api";

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: 'order' | 'delivery' | 'system';
    isRead: boolean;
    createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
};

export const markAsRead = async (id: string): Promise<Notification> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};
