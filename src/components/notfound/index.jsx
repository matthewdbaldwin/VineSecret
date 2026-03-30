import React from 'react';
import { Link } from 'react-router-dom';
import './notfound.css';

const NotFound = () => (
    <section className="not-found-page">
        <div className="not-found-card">
            <p className="eyebrow">404</p>
            <h1>Lost in the cellar.</h1>
            <p className="not-found-lede">
                The page you're looking for isn't here — it may have moved, been removed, or the link might be off.
            </p>
            <div className="not-found-actions">
                <Link className="btn primary" to="/">Back to home</Link>
                <Link className="btn brass" to="/products">Shop the release</Link>
            </div>
        </div>
    </section>
);

export default NotFound;
