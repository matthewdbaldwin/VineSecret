import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { trackEngagement } from '../../analytics/tracking';

const Home = () => (
    <div className="home">
        <section className="hero-grid">
            <div className="hero-card">
                <p className="eyebrow">New experiences</p>
                <h2>Estate-grown wines crafted for curious palates.</h2>
                <p className="lede">
                    Reserve-only flights, limited club allocations, and winemaker stories you won't find on the shelf.
                </p>
                <div className="cta-group">
                    <Link
                        className="btn primary"
                        to="/products"
                        onClick={() => trackEngagement('home_shop', 'home')}
                    >
                        Shop the release
                    </Link>
                    <Link className="btn ghost" to="/contact" onClick={() => trackEngagement('home_plan_tasting', 'home')}>
                        Plan a tasting
                    </Link>
                </div>
                <div className="hero-metrics">
                    <div>
                        <span className="metric">24</span>
                        <span className="label">Barrel lots</span>
                    </div>
                    <div>
                        <span className="metric">5</span>
                        <span className="label">Estate vineyards</span>
                    </div>
                    <div>
                        <span className="metric">72</span>
                        <span className="label">Club seats left</span>
                    </div>
                </div>
            </div>
            <div className="story-card">
                <div className="story-inner">
                    <p className="eyebrow">Cellar notes</p>
                    <h3>Listen to the vines whisper.</h3>
                    <p>
                        Sunrise harvests, native ferments, and patience. Every bottle captures the soil, fog, and hands that raised it.
                    </p>
                    <Link className="text-link" to="/about" onClick={() => trackEngagement('home_story', 'home')}>
                        Discover our craft →
                    </Link>
                </div>
            </div>
        </section>

        <section className="pillars">
            <div className="pillar">
                <h4>Single-vineyard focus</h4>
                <p>Each cuvée is fermented separately to protect the nuance of every block.</p>
            </div>
            <div className="pillar">
                <h4>Seasonal releases</h4>
                <p>Curated drops aligned to the growing season with pairings from our culinary team.</p>
            </div>
            <div className="pillar">
                <h4>Intentional hospitality</h4>
                <p>Private tastings by appointment with the people who farm and blend the wines.</p>
            </div>
        </section>

        <section className="collection">
            <div className="copy">
                <p className="eyebrow">Latest release</p>
                <h3>Spring reds, bottled at night.</h3>
                <p>
                    Syrah kissed by coastal fog, Grenache that hums with spice, and a reserve Cabernet destined for the cellar.
                </p>
                <Link className="btn primary" to="/products" onClick={() => trackEngagement('home_browse_collection', 'home')}>
                    Browse the collection
                </Link>
            </div>
            <div className="card-grid">
                <div className="mini-card">
                    <span className="metric">92</span>
                    <p>Average barrel selection score from the panel.</p>
                </div>
                <div className="mini-card">
                    <span className="metric">18 mo</span>
                    <p>French oak elevage to round each vintage.</p>
                </div>
                <div className="mini-card">
                    <span className="metric">Zero</span>
                    <p>Compromises to the vineyard story.</p>
                </div>
            </div>
        </section>

        <section className="visit">
            <div>
                <h3>Visit the cellar</h3>
                <p>
                    Your appointment begins in the vines and ends with a library pour in our barrel room.
                </p>
            </div>
            <Link className="btn ghost" to="/contact" onClick={() => trackEngagement('home_schedule_visit', 'home')}>
                Schedule your visit
            </Link>
        </section>
    </div>
);

export default Home;
