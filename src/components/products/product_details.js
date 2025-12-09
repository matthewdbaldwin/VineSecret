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

        return (
            <div className="product-details-page">
                <div className="details-card image-card">
                    <img src={details.image.url} alt={details.caption || details.name} />
                </div>

                <div className="details-card info-card">
                    <p className="eyebrow">Estate release</p>
                    <h2>{details.name}</h2>
                    <p className="lead">{details.caption}</p>
                    <p className="description">{details.description}</p>

                    <div className="badge-row">
                        <span className="pill">Neutral French oak</span>
                        <span className="pill">Native ferment</span>
                        <span className="pill">Cold pack shipping</span>
                    </div>

                    <div className="price-row">
                        <div>
                            <span className="price">
                                <Money cost={details.cost} />
                            </span>
                            <p className="tiny">Includes taxes — shipping calculated at checkout.</p>
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
