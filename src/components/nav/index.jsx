import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './nav.css';

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);
    const cartItems = useSelector((state) => state.cart.items || []);
    const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

    return (
        <nav className={`navbar site-nav ${menuOpen ? 'is-open' : ''}`}>
            <div className="nav-branding">
                <Link className="brand-name" to="/" onClick={closeMenu}>
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
                    <Link className="menuList link" to="/" onClick={closeMenu}>Home</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className="menuList link" to="/products" onClick={closeMenu}>Wines</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className="menuList link" to="/about" onClick={closeMenu}>Our story</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className="menuList link" to="/contact" onClick={closeMenu}>Visit</Link>
                </li>
                <li className="nav-item nav-link cart-link">
                    <Link className="menuList link" to="/cart" onClick={closeMenu}>
                        Cart
                        <span className="cart-pill" aria-label={`${itemCount} items in cart`}>
                            {itemCount}
                        </span>
                    </Link>
                </li>
                <li className="nav-item nav-link nav-cta">
                    <Link className="menuList link" to="/contact" onClick={closeMenu}>Book a tasting</Link>
                </li>
            </ul>
        </nav>
    );
};
export default Nav;
