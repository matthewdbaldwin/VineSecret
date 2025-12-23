import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import Nav from '../nav';
import { trackEngagement } from '../../analytics/tracking';

const Header = () => (
    <header className="site-header">
        <div className="header-overlay">
            <Nav />
            <div className="brand-block">
                <div className="brand-copy">
                    <p className="eyebrow">Vinesecret Estate</p>
                    <h1>Unlock limited California wines.</h1>
                    <p className="lede">
                        Small-lot vintages, single-vineyard stories, and a winemaking team obsessed
                        with letting every grape whisper its secret.
                    </p>
                    <div className="header-actions">
                        <Link
                            className="btn primary"
                            to="/products"
                            onClick={() => trackEngagement('header_shop', 'hero')}
                        >
                            Shop new releases
                        </Link>
                        <Link className="btn ghost" to="/contact" onClick={() => trackEngagement('header_visit', 'hero')}>
                            Visit the cellar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
