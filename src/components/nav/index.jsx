import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './nav.css';
import { trackEngagement } from '../../analytics/tracking';

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);
    const handleNavClick = (label) => {
        trackEngagement(label, 'navigation');
        closeMenu();
    };
    const cartItems = useSelector((state) => state.cart.items || []);
    const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

    return (
        <nav className={`navbar site-nav ${menuOpen ? 'is-open' : ''}`}>
            <div className="nav-branding">
                <Link className="brand-name" to="/" onClick={() => handleNavClick('brand_home')}>
                    <div className="brand-mark" aria-hidden="true" />
                    <span className="brand-subtitle">Estate Winery</span>
                </Link>
            </div>
            
            <button
                className="nav-toggle"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
                onClick={toggleMenu}
                type="button"
            >
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
            </button>
            <ul className={`main-nav ${menuOpen ? 'open' : ''}`}>
                <li className="nav-item nav-link active">
                    <Link className="menuList link" to="/" onClick={() => handleNavClick('nav_home')}>Home</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className="menuList link" to="/products" onClick={() => handleNavClick('nav_products')}>Wines</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className="menuList link" to="/about" onClick={() => handleNavClick('nav_about')}>Our story</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className="menuList link" to="/contact" onClick={() => handleNavClick('nav_visit')}>Visit</Link>
                </li>
                <li className="nav-item nav-link cart-link">
                    <Link className="menuList link" to="/cart" onClick={() => handleNavClick('nav_cart')}>
                        Cart
                        <span className="cart-pill" aria-label={`${itemCount} items in cart`}>
                            {itemCount}
                        </span>
                    </Link>
                </li>
                <li className="nav-item nav-link nav-cta">
                    <Link className="menuList link" to="/contact" onClick={() => handleNavClick('nav_book_tasting')}>
                        Book a tasting
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
export default Nav;
