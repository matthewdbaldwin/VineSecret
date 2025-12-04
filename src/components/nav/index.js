import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar justify-content-right">
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
                    <Link className={`menuList link`} to="/" onClick={closeMenu}>HOME</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className={`menuList link`} to="/products" onClick={closeMenu}>PRODUCTS</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className={`menuList link`} to="/contact" onClick={closeMenu}>CONTACT</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className={`menuList link`} to="/about" onClick={closeMenu}>ABOUT US</Link>
                </li>

            </ul>
        </nav>
    );
};
export default Nav;
