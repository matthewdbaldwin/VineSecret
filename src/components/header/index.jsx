import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import Nav from '../nav';

const Header = () => (
    <header className="site-header">
        <div className="header-overlay">
            <Nav />
            <div className="brand-block">
                <div className="brand-mark" aria-hidden="true" />
                <div className="brand-copy">
                    <p className="eyebrow">Vinesecret Estate</p>
                    <h1>Unlock limited California wines.</h1>
                    <p className="lede">
                        Small-lot vintages, single-vineyard stories, and a winemaking team obsessed
                        with letting every grape whisper its secret.
                    </p>
                    <div className="header-actions">
                        <Link className="btn primary" to="/products">Shop new releases</Link>
                        <Link className="btn ghost" to="/contact">Visit the cellar</Link>
                    </div>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
