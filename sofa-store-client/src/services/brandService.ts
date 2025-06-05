import axios from 'axios';

const API_URL = 'http://localhost:3000/api/brands'; // Замените на ваш URL бэкенда

export interface Brand {
    brand_id?: number; // Используем brand_id вместо id
    brand_name: string; // Используем brand_name вместо name
}

export const getBrands = async (): Promise<Brand[]> => {
    const response = await axios.get<{ data: Brand[] }>(API_URL);
    return response.data.data; // Извлечение массива брендов из поля data
};

export const getBrandById = async (id: number): Promise<Brand> => {
    const response = await axios.get<Brand>(`${API_URL}/${id}`);
    return response.data; // Предполагается, что API возвращает бренд в нужном формате
};

export const createBrand = async (brand: Brand): Promise<Brand> => {
    const response = await axios.post<Brand>(API_URL, brand);
    return response.data; // Предполагается, что API возвращает созданный бренд
};

export const updateBrand = async (id: number, updatedData: { brand_name: string }): Promise<Brand> => {
    const response = await axios.patch<Brand>(`${API_URL}/${id}`, updatedData);
    return response.data; // Предполагается, что API возвращает обновленный бренд
};

export const deleteBrand = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
