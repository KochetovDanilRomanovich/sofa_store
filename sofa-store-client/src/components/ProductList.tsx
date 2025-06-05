import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct, updateProduct, getProductById, type Product } from '../services/productService';
import './ProductList.css';

// Определяем тип для нового продукта (без вложенных brand и model)
type NewProduct = {
    name: string;
    current_price: number;
    stock_quantity: number;
    brand_id: number;
    model_id: number;
};

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<NewProduct>({
        name: '',
        current_price: 0,
        stock_quantity: 0,
        brand_id: 0,
        model_id: 0,
    });
    const [productIdToFind, setProductIdToFind] = useState<number | ''>('');
    const [productIdToUpdate, setProductIdToUpdate] = useState<number | ''>('');
    const [updatedProduct, setUpdatedProduct] = useState<Partial<NewProduct>>({});
    const [productIdToDelete, setProductIdToDelete] = useState<number | ''>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const productsData = await getProducts();
            setProducts(productsData.sort((a, b) => a.product_id - b.product_id));
        } catch (error: unknown) {
            setErrorMessage('Ошибка при получении диванов');
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name.trim() || newProduct.current_price <= 0 || newProduct.stock_quantity <= 0 || newProduct.brand_id <= 0 || newProduct.model_id <= 0) {
            setErrorMessage('Пожалуйста, заполните все поля корректно');
            return;
        }

        try {
            const existingProduct = products.find(product => 
                product.name === newProduct.name &&
                product.brand.brand_id === newProduct.brand_id &&
                product.model.model_id === newProduct.model_id
            );

            if (existingProduct) {
                setErrorMessage('Диван с такими данными уже существует');
                return;
            }

            await createProduct({
                name: newProduct.name,
                current_price: newProduct.current_price,
                stock_quantity: newProduct.stock_quantity,
                brand_id: newProduct.brand_id,
                model_id: newProduct.model_id
            });
            
            setNewProduct({ name: '', current_price: 0, stock_quantity: 0, brand_id: 0, model_id: 0 });
            fetchProducts();
        } catch (error: unknown) {
            setErrorMessage('Ошибка при добавлении дивана: ' + (error as Error).message);
        }
    };

    const handleDeleteProduct = async () => {
        if (productIdToDelete && productIdToDelete > 0) {
            try {
                await deleteProduct(productIdToDelete);
                setProductIdToDelete('');
                fetchProducts();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при удалении дивана: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для удаления');
        }
    };

    const handleFindProduct = async () => {
        if (productIdToFind && productIdToFind > 0) {
            try {
                const product = await getProductById(productIdToFind);
                if (product) {
                    alert(`Диван найден: ${product.name}, Бренд: ${product.brand.brand_name}, Модель: ${product.model.model_name}, Цена: ${product.current_price}, Количество: ${product.stock_quantity}`);
                } else {
                    setErrorMessage('Диван не найден');
                }
            } catch (error: unknown) {
                setErrorMessage('Ошибка при поиске дивана: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID');
        }
    };

    const handleUpdateProduct = async () => {
        if (productIdToUpdate && productIdToUpdate > 0) {
            // Проверяем, что хотя бы одно поле изменено
            if (!updatedProduct.name && updatedProduct.current_price === undefined && updatedProduct.stock_quantity === undefined && updatedProduct.brand_id === undefined && updatedProduct.model_id === undefined) {
                setErrorMessage('Необходимо изменить хотя бы одно поле');
                return;
            }

            try {
                await updateProduct(productIdToUpdate, updatedProduct);
                setProductIdToUpdate('');
                setUpdatedProduct({});
                fetchProducts();
            } catch (error: unknown) {
                setErrorMessage('Ошибка при обновлении дивана: ' + (error as Error).message);
            }
        } else {
            setErrorMessage('Введите положительный ID для обновления');
        }
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="product-list-container">
            <h1>Список диванов</h1>
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Количество</th>
                            <th>Бренд</th>
                            <th>Модель</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.product_id}>
                                <td>{product.product_id}</td>
                                <td>{product.name}</td>
                                <td>{product.current_price}</td>
                                <td>{product.stock_quantity}</td>
                                <td>{product.brand.brand_name}</td>
                                <td>{product.model.model_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="form-container">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Название дивана"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                        type="number" 
                        placeholder="Цена дивана"
                        value={newProduct.current_price || ''}
                        onChange={(e) => {
                            const price = parseFloat(e.target.value);
                            if (!isNaN(price)) {
                                setNewProduct({ ...newProduct, current_price: price });
                            }
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Количество в наличии"
                        value={newProduct.stock_quantity || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="ID бренда"
                        value={newProduct.brand_id || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, brand_id: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="ID модели"
                        value={newProduct.model_id || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, model_id: Number(e.target.value) })}
                    />
                    <button onClick={handleAddProduct}>Добавить диван</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID дивана для поиска"
                        value={productIdToFind || ''}
                        onChange={(e) => setProductIdToFind(Number(e.target.value))}
                    />
                    <button onClick={handleFindProduct}>Найти диван по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID дивана для изменения"
                        value={productIdToUpdate || ''}
                        onChange={(e) => setProductIdToUpdate(Number(e.target.value))}
                    />
                    <input
                        type="text"
                        placeholder="Новое название дивана"
                        value={updatedProduct.name || ''}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Новая цена дивана"
                        value={updatedProduct.current_price || ''}
                        onChange={(e) => {
                            const price = parseFloat(e.target.value);
                            if (!isNaN(price)) {
                                setUpdatedProduct({ ...updatedProduct, current_price: price });
                            }
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Новое количество"
                        value={updatedProduct.stock_quantity || ''}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, stock_quantity: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Новый ID бренда"
                        value={updatedProduct.brand_id || ''}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, brand_id: Number(e.target.value) })}
                    />
                    <input
                        type="number"
                        placeholder="Новый ID модели"
                        value={updatedProduct.model_id || ''}
                        onChange={(e) => setUpdatedProduct({ ...updatedProduct, model_id: Number(e.target.value) })}
                    />
                    <button onClick={handleUpdateProduct}>Изменить диван по ID</button>
                </div>

                <div className="input-group">
                    <input
                        type="number"
                        placeholder="ID дивана для удаления"
                        value={productIdToDelete || ''}
                        onChange={(e) => setProductIdToDelete(Number(e.target.value))}
                    />
                    <button onClick={handleDeleteProduct}>Удалить диван по ID</button>
                </div>
            </div>

            {errorMessage && (
                <div className="error-popup">
                    <div className="error-message">
                        <span>{errorMessage}</span>
                        <button className="close-button" onClick={handleCloseError}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
