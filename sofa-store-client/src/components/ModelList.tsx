import React, { useState, useEffect } from 'react';
import { getModels, createModel, deleteModel, updateModel, getModelById, type Model } from '../services/modelService';
import './ModelList.css'; // Импортируем CSS файл

const ModelList: React.FC = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [newModel, setNewModel] = useState<Model>({ model_name: '' });
    const [modelIdToFind, setModelIdToFind] = useState<number | ''>('');
    const [modelIdToUpdate, setModelIdToUpdate] = useState<number | ''>('');
    const [updatedModelName, setUpdatedModelName] = useState<string>('');
    const [modelIdToDelete, setModelIdToDelete] = useState<number | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchModels = async () => {
        try {
            const modelsData = await getModels();
            setModels(modelsData.sort((a, b) => (a.model_id || 0) - (b.model_id || 0)));
        } catch (error: unknown) {
            setErrorMessage('Ошибка при получении моделей');
        }
    };

    const handleAddModel = async () => {
        if (!newModel.model_name.trim()) {
            setErrorMessage('Имя модели не может быть пустым');
            return;
        }

        try {
            const existingModel = await getModelByName(newModel.model_name);
            if (existingModel) {
                setErrorMessage('Модель с таким именем уже существует');
                return;
            }

            await createModel(newModel);
            setNewModel({ model_name: '' });
            fetchModels();
        } catch (error: unknown) {
            setErrorMessage('Ошибка при добавлении модели: ' + (error as Error).message);
        }
    };

    const handleDeleteModel = async () => {
        if (modelIdToDelete && modelIdToDelete > 0) {
            try {
                await deleteModel(modelIdToDelete);
                setModelIdToDelete('');
                fetchModels();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при удалении модели: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для удаления');
        }
    };

    const handleFindModel = async () => {
        if (modelIdToFind && modelIdToFind > 0) {
            try {
                const model = await getModelById(modelIdToFind);
                if (model) {
                    alert(`Модель найдена: ${model.model_name}`);
                } else {
                    setErrorMessage('Модель не найдена');
                }
            } catch (error: unknown) {
                setErrorMessage('Ошибка при поиске модели: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID');
        }
    };

    const handleUpdateModel = async () => {
        if (modelIdToUpdate && modelIdToUpdate > 0 && updatedModelName) {
            try {
                await updateModel(modelIdToUpdate, { model_name: updatedModelName });
                setModelIdToUpdate('');
                setUpdatedModelName('');
                fetchModels();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при обновлении модели: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для обновления и новое имя модели');
        }
    };

    const getModelByName = async (modelName: string): Promise<Model | null> => {
        try {
            const modelsData = await getModels();
            const existingModel = modelsData.find(model => model.model_name === modelName);
            return existingModel || null;
        } catch (error: unknown) {
            setErrorMessage('Ошибка при поиске модели по имени: ' + (error as Error).message);
            return null;
        }
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    useEffect(() => {
        fetchModels();
    }, []);

    return (
        <div className="model-list-container">
            <h1>Список моделей</h1>
            <div className="table-container">
                <table className="model-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя модели</th>
                        </tr>
                    </thead>
                    <tbody>
                        {models.map(model => (
                            <tr key={model.model_id}>
                                <td>{model.model_id}</td>
                                <td>{model.model_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="form-container">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Имя модели"
                        value={newModel.model_name}
                        onChange={(e) => setNewModel({ ...newModel, model_name: e.target.value })}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleAddModel}>Добавить модель</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID модели для поиска"
                        value={modelIdToFind || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setModelIdToFind(value);
                            } else {
                                setModelIdToFind('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleFindModel}>Найти модель по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID модели для изменения"
                        value={modelIdToUpdate || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setModelIdToUpdate(value);
                            } else {
                                setModelIdToUpdate('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <input
                        type="text"
                        placeholder="Новое имя модели"
                        value={updatedModelName}
                        onChange={(e) => setUpdatedModelName(e.target.value)}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleUpdateModel}>Изменить модель по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID модели для удаления"
                        value={modelIdToDelete || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setModelIdToDelete(value);
                            } else {
                                setModelIdToDelete('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleDeleteModel}>Удалить модель по ID</button>
                </div>
            </div>

            {errorMessage && (
                <div className="error-popup">
                    <div className="error-message">
                        <span>{errorMessage}</span>
                        <button onClick={handleCloseError} className="close-button">Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelList;
