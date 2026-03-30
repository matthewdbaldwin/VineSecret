import React, { Component } from "react";
import { connect } from "react-redux";
import { addItemToCart, getAllProducts } from "../../actions";
import { trackAddToCart, trackEngagement } from "../../analytics/tracking";
import CartPopover from "../cart/cart_popover";
import ProductItem from "./product_item";
import "./products.css";

const TYPE_CATEGORIES = {
    all:   null,
    whites: ['Chardonnay', 'Sauvignon Blanc', 'Viognier'],
    reds:   ['Pinot Noir', 'Cabernet Sauvignon', 'GSM Blend', 'Syrah'],
    rose:   ['Rosé'],
};

const SORT_OPTIONS = [
    { value: 'featured',   label: 'Featured'         },
    { value: 'price-asc',  label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc',   label: 'Name: A–Z'         },
];

class Products extends Component {
    state = { popover: null, filterType: 'all', sortBy: 'featured' };

    componentDidMount() {
        this.props.getAllProducts();
    }

    componentWillUnmount() {
        clearTimeout(this._popoverTimer);
    }

    goToDetails = (id) => {
        trackEngagement('product_card_click', 'products');
        this.props.history.push(`/products/${id}`);
    };

    handleAddToCart = (product) => {
        trackAddToCart(product, 1);
        this.props.addItemToCart(product.id, 1);
        clearTimeout(this._popoverTimer);
        this.setState({ popover: { ...product, quantity: 1 } });
        this._popoverTimer = setTimeout(() => this.setState({ popover: null }), 3500);
    };

    dismissPopover = () => {
        clearTimeout(this._popoverTimer);
        this.setState({ popover: null });
    };

    getVisibleProducts() {
        const { products } = this.props;
        if (!products || products.length === 0) return [];
        const { filterType, sortBy } = this.state;

        const types = TYPE_CATEGORIES[filterType];
        let filtered = types ? products.filter((p) => types.includes(p.type)) : [...products];

        if (sortBy === 'price-asc')  filtered.sort((a, b) => a.cost - b.cost);
        if (sortBy === 'price-desc') filtered.sort((a, b) => b.cost - a.cost);
        if (sortBy === 'name-asc')   filtered.sort((a, b) => a.name.localeCompare(b.name));

        return filtered;
    }

    render() {
        const { products } = this.props;
        const { filterType, sortBy } = this.state;
        const visible = this.getVisibleProducts();
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
                                    onClick={() => this.setState({ filterType: key })}
                                    aria-pressed={filterType === key}
                                >
                                    {{ all: 'All', whites: 'Whites', reds: 'Reds', rose: 'Rosé' }[key]}
                                </button>
                            ))}
                        </div>
                        <label className="filter-sort-label" htmlFor="product-sort">
                            <span className="sr-only">Sort by</span>
                            <select
                                id="product-sort"
                                className="filter-sort"
                                value={sortBy}
                                onChange={(e) => this.setState({ sortBy: e.target.value })}
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
                                goToDetails={() => this.goToDetails(product.id)}
                                onAddToCart={() => this.handleAddToCart(product)}
                            />
                        ))
                    ) : hasProducts ? (
                        <div className="empty-state">
                            <h3>No wines match that filter.</h3>
                            <p>Try a different category or <button className="text-btn" onClick={() => this.setState({ filterType: 'all' })}>view all wines</button>.</p>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h3>Our cellar is restocking.</h3>
                            <p>Check back soon for the next allocation or contact us to reserve your seat.</p>
                        </div>
                    )}
                </section>

                {this.state.popover && (
                    <CartPopover item={this.state.popover} onClose={this.dismissPopover} />
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        products: state.products.list,
    };
}

export default connect(mapStateToProps, { getAllProducts, addItemToCart })(Products);
