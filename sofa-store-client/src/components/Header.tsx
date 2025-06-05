import React from 'react';
import './Header.css'; // Импортируем стили для Header

const Header: React.FC = () => {
    const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        event.preventDefault(); // Предотвращаем стандартное поведение ссылки
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Плавный переход к секции
        }
    };

    return (
        <header className="header">
            <div className="logo">
                <a href="#home" className="logo-link" onClick={(e) => scrollToSection(e, 'home')}>Sofa Store</a>
            </div>
            <nav className="nav">
                <ul>
                    <li><a href="#sofas" onClick={(e) => scrollToSection(e, 'home')}>Диваны</a></li>
                    <li><a href="#models" onClick={(e) => scrollToSection(e, 'models')}>Модели</a></li>
                    <li><a href="#brands" onClick={(e) => scrollToSection(e, 'brands')}>Бренды</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;