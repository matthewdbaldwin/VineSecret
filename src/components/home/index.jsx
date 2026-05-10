import React from 'react';
import { Link } from 'react-router-dom';
import { trackEngagement } from '../../analytics/tracking';
import './home.css';

const Home = () => (
    <div className="home">
        {/* Spread 1 — Estate masthead */}
        <section className="home-spread home-spread--masthead">
            <div className="home-spread__inner">
                <p className="eyebrow">Sonoma County · Estate</p>
                <h1 className="home-spread__title" aria-label="Vine Secret">
                    <span className="home-spread__title-row">Vine</span>
                    <span className="home-spread__title-row home-spread__title-row--italic">Secret</span>
                </h1>
                <p className="home-spread__lede">
                    Small-lot wines from one estate, raised slow and bottled by hand.
                </p>
                <div className="home-spread__cta">
                    <Link
                        className="btn primary"
                        to="/products"
                        onClick={() => trackEngagement('home_browse', 'home')}
                    >
                        Browse the release
                    </Link>
                    <Link
                        className="btn secondary"
                        to="/about"
                        onClick={() => trackEngagement('home_story', 'home')}
                    >
                        Read our story
                    </Link>
                </div>
            </div>
            <div className="home-spread__chrome" aria-hidden="true">
                <span>Scroll</span>
                <span>↓</span>
            </div>
        </section>

        {/* Spread 2 — Pinot Noir feature */}
        <section className="home-spread home-spread--pinot" data-varietal="pinot-noir">
            <div className="home-spread__inner home-spread__inner--split">
                <div className="home-spread__feature">
                    <p className="eyebrow">Estate release · Pinot Noir</p>
                    <h2 className="home-spread__heading">
                        Silk and Russian River fog.
                    </h2>
                    <p className="home-spread__copy">
                        Cold-soaked, native-fermented, raised in neutral French oak. Raspberry coulis,
                        rose petals, baking spice — a Pinot that whispers at first and lingers an hour later.
                    </p>
                    <Link
                        className="btn quiet"
                        to="/products/russian-river-pinot-2022"
                        onClick={() => trackEngagement('home_pinot', 'home')}
                    >
                        Read the bottle
                    </Link>
                </div>
                <figure className="home-spread__plate">
                    <span className="home-spread__plate-letter">P</span>
                </figure>
            </div>
        </section>

        {/* Spread 3 — Chardonnay feature (palette flip) */}
        <section className="home-spread home-spread--chardonnay" data-varietal="chardonnay">
            <div className="home-spread__inner home-spread__inner--split home-spread__inner--reverse">
                <div className="home-spread__feature">
                    <p className="eyebrow">Estate release · Chardonnay</p>
                    <h2 className="home-spread__heading">
                        Saline backbone, lemon curd finish.
                    </h2>
                    <p className="home-spread__copy">
                        Whole-cluster pressed and held nine months on lees in neutral French oak.
                        Coastal fog gives the acidity, the cellar gives the weight.
                    </p>
                    <Link
                        className="btn quiet"
                        to="/products/sonoma-coast-chardonnay-2023"
                        onClick={() => trackEngagement('home_chardonnay', 'home')}
                    >
                        Read the bottle
                    </Link>
                </div>
                <figure className="home-spread__plate">
                    <span className="home-spread__plate-letter">C</span>
                </figure>
            </div>
        </section>

        {/* Spread 4 — Cabernet feature */}
        <section className="home-spread home-spread--cabernet" data-varietal="cabernet-sauvignon">
            <div className="home-spread__inner home-spread__inner--split">
                <div className="home-spread__feature">
                    <p className="eyebrow">Library · Cabernet Sauvignon</p>
                    <h2 className="home-spread__heading">
                        Atlas Peak, twenty months in barrique.
                    </h2>
                    <p className="home-spread__copy">
                        Cassis, graphite, violets, and tobacco from rocky benchland blocks.
                        Patient élevage; bigger structure than its scale suggests.
                    </p>
                    <Link
                        className="btn quiet"
                        to="/products/atlas-peak-cabernet-2021"
                        onClick={() => trackEngagement('home_cabernet', 'home')}
                    >
                        Read the bottle
                    </Link>
                </div>
                <figure className="home-spread__plate">
                    <span className="home-spread__plate-letter">C</span>
                    <span className="home-spread__plate-sub">S</span>
                </figure>
            </div>
        </section>

        {/* Spread 5 — Story / Visit (noir close) */}
        <section className="home-spread home-spread--story">
            <div className="home-spread__inner home-spread__inner--narrow">
                <p className="eyebrow">From the cellar</p>
                <h2 className="home-spread__heading">
                    Native ferments, hand racking, no shortcuts.
                </h2>
                <p className="home-spread__copy prose">
                    We farm five blocks across Sonoma County by hand and ferment each lot separately —
                    sometimes in concrete, sometimes in oak, occasionally in clay. Every barrel gets
                    tasted; every blend goes in blind. The bottles you receive are the ones that
                    earned their way into the cuvée.
                </p>
                <div className="home-spread__cta">
                    <Link className="btn on-noir primary" to="/about" onClick={() => trackEngagement('home_about', 'home')}>
                        The story
                    </Link>
                    <Link className="btn on-noir secondary" to="/contact" onClick={() => trackEngagement('home_visit', 'home')}>
                        Schedule a visit
                    </Link>
                </div>
            </div>
        </section>
    </div>
);

export default Home;
