import api from './api';

export interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    stockQuantity: number;
    minThreshold: number;
    unit: string;
    imageUrl?: string;
    farmer: {
        _id: string;
        name: string;
        farmName: string;
    };
    createdAt: string;
    updatedAt: string;
    [key: string]: string | number | boolean | null | undefined | object;
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};
