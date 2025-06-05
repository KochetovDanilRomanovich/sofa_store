import React from 'react';
import BrandList from './components/BrandList';
import ModelList from './components/ModelList';
import ProductList from './components/ProductList';
import Header from './components/Header';

const App: React.FC = () => {
    return (
        <div>
            <Header />
            <div id="home" style={{ paddingTop: '60px' }}> {/* Отступ для фиксированного Header */}
                <ProductList />
            </div>
            <div id="models">
                <ModelList />
            </div>
            <div id="brands">
                <BrandList />
            </div>
        </div>
    );
};

export default App;
