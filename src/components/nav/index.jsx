import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={`navbar site-nav ${menuOpen ? 'is-open' : ''}`}>
            <div className="nav-branding">
                <Link className="brand-name" to="/" onClick={closeMenu}>
                    VineSecret
                </Link>
                <span className="brand-subtitle">Estate Winery</span>
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
                <li className="nav-item nav-link nav-cta">
                    <Link className="menuList link" to="/contact" onClick={closeMenu}>Book a tasting</Link>
                </li>
            </ul>
        </nav>
    );
};
export default Nav;
