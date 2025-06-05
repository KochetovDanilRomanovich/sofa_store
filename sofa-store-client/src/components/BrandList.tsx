import React, { useState, useEffect } from 'react';
import { getBrands, createBrand, deleteBrand, updateBrand, getBrandById, type Brand } from '../services/brandService';
import './BrandList.css'; // Импортируем CSS файл

const BrandList: React.FC = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [newBrand, setNewBrand] = useState<Brand>({ brand_name: '' });
    const [brandIdToFind, setBrandIdToFind] = useState<number | ''>('');
    const [brandIdToUpdate, setBrandIdToUpdate] = useState<number | ''>('');
    const [updatedBrandName, setUpdatedBrandName] = useState<string>('');
    const [brandIdToDelete, setBrandIdToDelete] = useState<number | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchBrands = async () => {
        try {
            const brandsData = await getBrands();
            setBrands(brandsData.sort((a, b) => (a.brand_id || 0) - (b.brand_id || 0)));
        } catch (error: unknown) {
            setErrorMessage('Ошибка при получении брендов');
        }
    };

    const handleAddBrand = async () => {
        if (!newBrand.brand_name.trim()) {
            setErrorMessage('Имя бренда не может быть пустым');
            return;
        }

        try {
            const existingBrand = await getBrandByName(newBrand.brand_name);
            if (existingBrand) {
                setErrorMessage('Бренд с таким именем уже существует');
                return;
            }

            await createBrand(newBrand);
            setNewBrand({ brand_name: '' });
            fetchBrands();
        } catch (error: unknown) {
            setErrorMessage('Ошибка при добавлении бренда: ' + (error as Error).message);
        }
    };

    const handleDeleteBrand = async () => {
        if (brandIdToDelete && brandIdToDelete > 0) {
            try {
                await deleteBrand(brandIdToDelete);
                setBrandIdToDelete('');
                fetchBrands();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при удалении бренда: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для удаления');
        }
    };

    const handleFindBrand = async () => {
        if (brandIdToFind && brandIdToFind > 0) {
            try {
                const brand = await getBrandById(brandIdToFind);
                if (brand) {
                    alert(`Бренд найден: ${brand.brand_name}`);
                } else {
                    setErrorMessage('Бренд не найден');
                }
            } catch (error: unknown) {
                setErrorMessage('Ошибка при поиске бренда: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID');
        }
    };

    const handleUpdateBrand = async () => {
        if (brandIdToUpdate && brandIdToUpdate > 0 && updatedBrandName) {
            try {
                await updateBrand(brandIdToUpdate, { brand_name: updatedBrandName });
                setBrandIdToUpdate('');
                setUpdatedBrandName('');
                fetchBrands();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при обновлении бренда: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для обновления и новое имя бренда');
        }
    };

    const getBrandByName = async (brandName: string): Promise<Brand | null> => {
        try {
            const brandsData = await getBrands();
            const existingBrand = brandsData.find(brand => brand.brand_name === brandName);
            return existingBrand || null;
        } catch (error: unknown) {
            setErrorMessage('Ошибка при поиске бренда по имени: ' + (error as Error).message);
            return null;
        }
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <div className="brand-list-container">
            <h1>Список брендов</h1>
            <div className="table-container">
                <table className="brand-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя бренда</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map(brand => (
                            <tr key={brand.brand_id}>
                                <td>{brand.brand_id}</td>
                                <td>{brand.brand_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="form-container">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Имя бренда"
                        value={newBrand.brand_name}
                        onChange={(e) => setNewBrand({ ...newBrand, brand_name: e.target.value })}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleAddBrand}>Добавить бренд</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID бренда для поиска"
                        value={brandIdToFind || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setBrandIdToFind(value);
                            } else {
                                setBrandIdToFind('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleFindBrand}>Найти бренд по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID бренда для изменения"
                        value={brandIdToUpdate || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setBrandIdToUpdate(value);
                            } else {
                                setBrandIdToUpdate('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <input
                        type="text"
                        placeholder="Новое имя бренда"
                        value={updatedBrandName}
                        onChange={(e) => setUpdatedBrandName(e.target.value)}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleUpdateBrand}>Изменить бренд по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID бренда для удаления"
                        value={brandIdToDelete || ''}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0) {
                                setBrandIdToDelete(value);
                            } else {
                                setBrandIdToDelete('');
                            }
                        }}
                        style={{ backgroundColor: '#f2f2f2', color: '#333' }}
                    />
                    <button onClick={handleDeleteBrand}>Удалить бренд по ID</button>
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

export default BrandList;
