import axios from 'axios';

const API_URL = 'http://localhost:3000/api/models'; // Замените на ваш URL бэкенда

export interface Model {
    model_id?: number; // Используем model_id вместо id
    model_name: string; // Используем model_name вместо name
}

export const getModels = async (): Promise<Model[]> => {
    const response = await axios.get<{ data: Model[] }>(API_URL);
    return response.data.data; // Извлечение массива моделей из поля data
};

export const getModelById = async (id: number): Promise<Model> => {
    const response = await axios.get<Model>(`${API_URL}/${id}`);
    return response.data; // Предполагается, что API возвращает модель в нужном формате
};

export const createModel = async (model: Model): Promise<Model> => {
    const response = await axios.post<Model>(API_URL, model);
    return response.data; // Предполагается, что API возвращает созданную модель
};

export const updateModel = async (id: number, updatedData: { model_name: string }): Promise<Model> => {
    const response = await axios.patch<Model>(`${API_URL}/${id}`, updatedData);
    return response.data; // Предполагается, что API возвращает обновленную модель
};

export const deleteModel = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
