import api from './api';

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    country?: string;
    phone?: string;
    token: string;
}

export const login = async (email: string, password: string, role?: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password, role });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const forgotPassword = async (email: string): Promise<{ message: string; resetToken?: string }> => {
    const response = await api.post('/auth/forgotpassword', { email });
    return response.data;
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.put(`/auth/resetpassword/${token}`, { password });
    return response.data;
};
