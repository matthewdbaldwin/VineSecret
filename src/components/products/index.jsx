import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllProducts } from "../../actions/index.js";
import ProductItem from "./product_item";
import "./products.css";

class Products extends Component {
    componentDidMount() {
        this.props.getAllProducts();
    }

    goToDetails = (id) => {
        this.props.history.push(`/products/${id}`);
    };

    render() {
        const { products } = this.props;
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
                        <div className="hero-metrics">
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
                            <p className="eyebrow">Shipping</p>
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

                <section className="product-grid" aria-label="Available wines">
                    {hasProducts ? (
                        products.map((product) => (
                            <ProductItem key={product.id} {...product} goToDetails={() => this.goToDetails(product.id)} />
                        ))
                    ) : (
                        <div className="empty-state">
                            <h3>Our cellar is restocking.</h3>
                            <p>Check back soon for the next allocation or contact us to reserve your seat.</p>
                        </div>
                    )}
                </section>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        products: state.products.list,
    };
}

export default connect(mapStateToProps, { getAllProducts })(Products);
