import React, { Component } from "react";
import { connect } from "react-redux";
import { addItemToCart, clearProductDetails, getProductDetails } from "../../actions/";
import Money from "../general/money";
import "./products.css";

class ProductDetails extends Component {
    state = {
        quantity: 1,
    };

    componentDidMount() {
        const {
            getProductDetails,
            match: { params },
        } = this.props;

        getProductDetails(params.product_id);
    }

    componentWillUnmount() {
        this.props.clearProductDetails();
    }

    incrementQuantity = () => {
        this.setState(({ quantity }) => ({ quantity: quantity + 1 }));
    };

    decrementQuantity = () => {
        this.setState(({ quantity }) => ({ quantity: Math.max(1, quantity - 1) }));
    };

    handleAddToCart = async () => {
        const { details, addItemToCart, history } = this.props;
        const { quantity } = this.state;

        await addItemToCart(details.id, quantity);
        history.push("/cart");
    };

    render() {
        const { details } = this.props;

        if (!details) {
            return (
                <div className="product-details-page loading-state">
                    <p>Loading product details…</p>
                </div>
            );
        }

        const highlightPills = ["Neutral French oak", "Native ferment", "Cold pack shipping"];

        const technicalNotes = [
            "Hand harvested and gently pressed for clarity and lift.",
            "Fermented cool to preserve aromatics and site expression.",
            "Unfined and unfiltered with minimal intervention in the cellar.",
        ];

        return (
            <div className="product-details-page">
                <section className="product-details-hero">
                    <div className="hero-copy">
                        <p className="eyebrow">Estate release</p>
                        <h1>{details.name}</h1>
                        <p className="lead">{details.caption}</p>
                        <div className="badge-row">
                            {highlightPills.map((pill) => (
                                <span key={pill} className="pill">
                                    {pill}
                                </span>
                            ))}
                        </div>
                        <div className="price-row">
                            <div>
                                <span className="price">
                                    <Money cost={details.cost} />
                                </span>
                                <p className="tiny">Taxes included — temp-controlled shipping available.</p>
                            </div>
                            <div className="quantity-group" aria-label="Quantity selector">
                                <button className="btn-quantity" onClick={this.decrementQuantity}>
                                    -
                                </button>
                                <span className="quantity">{this.state.quantity}</span>
                                <button className="btn-quantity" onClick={this.incrementQuantity}>
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="cta-row">
                            <button className="btn primary" onClick={this.handleAddToCart}>
                                Add to cart
                            </button>
                            <button className="btn ghost" onClick={() => this.props.history.push("/contact")}>
                                Visit the cellar
                            </button>
                        </div>
                    </div>
                    <div className="hero-image details-card image-card">
                        <img src={details.image.url} alt={details.caption || details.name} />
                    </div>
                </section>

                <section className="product-details-layout" aria-label="Product details">
                    <div className="details-card info-card">
                        <p className="eyebrow">Winemaker's notes</p>
                        <h2>Crafted for balance and place.</h2>
                        <p className="description">{details.description}</p>

                        <ul className="note-list">
                            {technicalNotes.map((note) => (
                                <li key={note}>{note}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="details-card info-card secondary">
                        <p className="eyebrow">Serving & cellaring</p>
                        <h3>Pour with confidence.</h3>
                        <p className="description">
                            Serve lightly chilled and allow the wine to open for a few minutes in the glass. Bottles ship with
                            cold packs when needed and arrive ready to share.
                        </p>
                        <div className="meta-grid">
                            <div>
                                <span className="label">Drink window</span>
                                <p className="metric">Now – 2030</p>
                            </div>
                            <div>
                                <span className="label">Ideal temp</span>
                                <p className="metric">55–60°F</p>
                            </div>
                            <div>
                                <span className="label">Bottle size</span>
                                <p className="metric">750 ml</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        details: state.products.details,
    };
}

export default connect(mapStateToProps, {
    addItemToCart,
    clearProductDetails,
    getProductDetails,
})(ProductDetails);
