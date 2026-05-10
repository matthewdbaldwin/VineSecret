import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemToCart, getAllProducts } from "../../actions";
import { trackAddToCart, trackEngagement } from "../../analytics/tracking";
import CartPopover from "../cart/cart_popover";
import ProductItem from "./product_item";
import "./products.css";

const TYPE_CATEGORIES = {
    all:   null,
    whites: ['Chardonnay', 'Sauvignon Blanc', 'Viognier'],
    reds:   ['Pinot Noir', 'Cabernet Sauvignon', 'GSM Blend', 'Syrah', 'Zinfandel'],
    rose:   ['Rosé'],
};

const SORT_OPTIONS = [
    { value: 'featured',   label: 'Featured'         },
    { value: 'price-asc',  label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc',   label: 'Name: A–Z'         },
];

const FILTER_LABELS = { all: 'All', whites: 'Whites', reds: 'Reds', rose: 'Rosé' };

const Products = () => {
    const products = useSelector((state) => state.products.list);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [popover, setPopover] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const popoverTimer = useRef(null);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    useEffect(() => () => clearTimeout(popoverTimer.current), []);

    const goToDetails = (id) => {
        trackEngagement('product_card_click', 'products');
        if (typeof document !== 'undefined' && document.startViewTransition) {
            document.startViewTransition(() => {
                flushSync(() => navigate(`/products/${id}`));
            });
        } else {
            navigate(`/products/${id}`);
        }
    };

    const handleAddToCart = (product) => {
        trackAddToCart(product, 1);
        dispatch(addItemToCart(product.id, 1));
        clearTimeout(popoverTimer.current);
        setPopover({ ...product, quantity: 1 });
        popoverTimer.current = setTimeout(() => setPopover(null), 3500);
    };

    const dismissPopover = () => {
        clearTimeout(popoverTimer.current);
        setPopover(null);
    };

    const getVisibleProducts = () => {
        if (!products || products.length === 0) return [];
        const types = TYPE_CATEGORIES[filterType];
        let filtered = types ? products.filter((p) => types.includes(p.type)) : [...products];

        if (sortBy === 'price-asc')  filtered.sort((a, b) => a.cost - b.cost);
        if (sortBy === 'price-desc') filtered.sort((a, b) => b.cost - a.cost);
        if (sortBy === 'name-asc')   filtered.sort((a, b) => a.name.localeCompare(b.name));

        return filtered;
    };

    const visible = getVisibleProducts();
    const hasProducts = products && products.length > 0;

    return (
        <div className="products">
            <section className="products-hero">
                <div className="products-hero__copy">
                    <p className="eyebrow">Current release</p>
                    <h1>Wines that carry the story of each block.</h1>
                    <p>
                        Limited lots grown under coastal influence and bottled with intention. Explore tasting notes,
                        aging windows, and vineyard sourcing for every bottle.
                    </p>
                    <div className="products-metrics">
                        <div>
                            <span className="metric">12</span>
                            <span className="label">Small-batch lots</span>
                        </div>
                        <div>
                            <span className="metric">30%</span>
                            <span className="label">Club reserved</span>
                        </div>
                        <div>
                            <span className="metric">94</span>
                            <span className="label">Panel average</span>
                        </div>
                    </div>
                </div>
                <div className="products-hero__panel">
                    <div className="panel-card">
                        <p className="eyebrow">Release notes</p>
                        <ul>
                            <li>Native fermentations with minimal handling.</li>
                            <li>Barrel-aged in neutral French oak for lifted aromatics.</li>
                            <li>Hand-labeled and bottled under moonlight in April.</li>
                        </ul>
                    </div>
                    <div className="panel-card highlight">
                        <p className="eyebrow-p">Shipping</p>
                        <h3>Cold packs to most states.</h3>
                        <p>Complimentary upgrades for club members and all 3+ bottle orders.</p>
                    </div>
                </div>
            </section>

            <section className="release-details">
                <div>
                    <h3>Cellar with confidence.</h3>
                    <p>
                        Every cuvée includes suggested drink windows, serving temperatures, and winemaker pairing
                        guidance. We list ferment vessels, élevage time, and clone selections to help collectors plan
                        their verticals.
                    </p>
                </div>
                <div className="pillars">
                    <div className="pillar">
                        <h4>Farm first</h4>
                        <p>Dry-farmed rows picked at night to lock in aromatics.</p>
                    </div>
                    <div className="pillar">
                        <h4>Thoughtful élevage</h4>
                        <p>Neutral oak, gentle racking, and ample time on lees.</p>
                    </div>
                    <div className="pillar">
                        <h4>Ready to pour</h4>
                        <p>Tight release windows ensure bottles arrive rested.</p>
                    </div>
                </div>
            </section>

            {hasProducts && (
                <div className="filter-bar" role="group" aria-label="Filter and sort wines">
                    <div className="filter-pills">
                        {Object.keys(TYPE_CATEGORIES).map((key) => (
                            <button
                                key={key}
                                type="button"
                                className={`filter-pill${filterType === key ? ' is-active' : ''}`}
                                onClick={() => setFilterType(key)}
                                aria-pressed={filterType === key}
                            >
                                {FILTER_LABELS[key]}
                            </button>
                        ))}
                    </div>
                    <label className="filter-sort-label" htmlFor="product-sort">
                        <span className="sr-only">Sort by</span>
                        <select
                            id="product-sort"
                            className="filter-sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            <section className="product-grid" aria-label="Available wines">
                {visible.length > 0 ? (
                    visible.map((product) => (
                        <ProductItem
                            key={product.id}
                            {...product}
                            goToDetails={() => goToDetails(product.id)}
                            onAddToCart={() => handleAddToCart(product)}
                        />
                    ))
                ) : hasProducts ? (
                    <div className="empty-state">
                        <h3>No wines match that filter.</h3>
                        <p>Try a different category or <button className="text-btn" onClick={() => setFilterType('all')}>view all wines</button>.</p>
                    </div>
                ) : (
                    <div className="empty-state">
                        <h3>Our cellar is restocking.</h3>
                        <p>Check back soon for the next allocation or contact us to reserve your seat.</p>
                    </div>
                )}
            </section>

            {popover && (
                <CartPopover item={popover} onClose={dismissPopover} />
            )}
        </div>
    );
};

export default Products;
