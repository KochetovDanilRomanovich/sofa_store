import axios from 'axios';

export type Product = {
    product_id: number;
    name: string;
    current_price: number;
    stock_quantity: number;
    brand: {
        brand_id: number;
        brand_name: string;
    };
    model: {
        model_id: number;
        model_name: string;
    };
};

type CreateProductDto = {
    name: string;
    current_price: number;
    stock_quantity: number;
    brand_id: number;
    model_id: number;
};

type UpdateProductDto = Partial<CreateProductDto>;

const API_URL = 'http://localhost:3000/api/products'; 

export const getProducts = async (): Promise<Product[]> => {
    const response = await axios.get(API_URL);
    return response.data.data;
};

export const createProduct = async (product: CreateProductDto): Promise<Product> => {
    const response = await axios.post(API_URL, product);
    return response.data;
};

export const updateProduct = async (productId: number, product: UpdateProductDto): Promise<Product> => {
    const response = await axios.patch(`${API_URL}/${productId}`, product);
    return response.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${productId}`);
};

export const getProductById = async (productId: number): Promise<Product | null> => {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data || null;
};
