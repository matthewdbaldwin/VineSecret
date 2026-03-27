import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './bottom-nav.css';
import { trackEngagement } from '../../analytics/tracking';

const BottomNav = () => {
    const location = useLocation();
    const [moreOpen, setMoreOpen] = useState(false);
    const cartItems = useSelector((state) => state.cart.items || []);
    const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

    const path = location.pathname;
    const isHome = path === '/';
    const isWines = path.startsWith('/products');
    const isCart = path === '/cart' || path === '/checkout';
    const isMore = path === '/about' || path === '/contact';

    const closeMore = (label) => {
        trackEngagement(label, 'bottom_nav');
        setMoreOpen(false);
    };

    return (
        <>
            {moreOpen && (
                <div className="bottom-nav-overlay" onClick={() => setMoreOpen(false)}>
                    <div className="bottom-nav-more-sheet" onClick={(e) => e.stopPropagation()}>
                        <div className="more-sheet-handle" />
                        <nav className="more-sheet-links">
                            <Link to="/about" onClick={() => closeMore('more_about')}>Our story</Link>
                            <Link to="/contact" onClick={() => closeMore('more_visit')}>Visit the cellar</Link>
                            <Link to="/contact" className="more-sheet-cta" onClick={() => closeMore('more_book')}>
                                Book a tasting
                            </Link>
                        </nav>
                    </div>
                </div>
            )}

            <nav className="bottom-nav" aria-label="Main navigation">
                <Link
                    to="/"
                    className={`bottom-tab ${isHome ? 'is-active' : ''}`}
                    onClick={() => trackEngagement('tab_home', 'bottom_nav')}
                    aria-label="Home"
                >
                    <svg className="tab-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
                        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
                    </svg>
                    <span>Home</span>
                </Link>

                <Link
                    to="/products"
                    className={`bottom-tab ${isWines ? 'is-active' : ''}`}
                    onClick={() => trackEngagement('tab_wines', 'bottom_nav')}
                    aria-label="Wines"
                >
                    <svg className="tab-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M8 2h8l1 7c0 3.314-2.686 6-6 6s-6-2.686-6-6L8 2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
                        <path d="M12 15v5M8 20h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                    <span>Wines</span>
                </Link>

                <Link
                    to="/cart"
                    className={`bottom-tab ${isCart ? 'is-active' : ''}`}
                    onClick={() => trackEngagement('tab_cart', 'bottom_nav')}
                    aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
                >
                    <span className="tab-icon-wrap">
                        <svg className="tab-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
                            <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                        </svg>
                        {itemCount > 0 && (
                            <span className="tab-badge" aria-hidden="true">{itemCount > 9 ? '9+' : itemCount}</span>
                        )}
                    </span>
                    <span>Cart</span>
                </Link>

                <button
                    className={`bottom-tab ${isMore ? 'is-active' : ''}`}
                    onClick={() => setMoreOpen(!moreOpen)}
                    aria-label="More navigation options"
                    aria-expanded={moreOpen}
                    type="button"
                >
                    <svg className="tab-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="5" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
                    </svg>
                    <span>More</span>
                </button>
            </nav>
        </>
    );
};

export default BottomNav;
