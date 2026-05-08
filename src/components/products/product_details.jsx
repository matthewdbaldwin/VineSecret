import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addItemToCart, clearProductDetails, getProductDetails } from "../../actions/";
import { trackAddToCart, trackProductView } from "../../analytics/tracking";
import CartPopover from "../cart/cart_popover";
import Money from "../general/money";
import "./products.css";

const ProductDetails = () => {
    const { product_id } = useParams();
    const details = useSelector((state) => state.products.details);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [popover, setPopover] = useState(null);
    const popoverTimer = useRef(null);
    const lastTrackedId = useRef(null);

    useEffect(() => {
        dispatch(getProductDetails(product_id));
        return () => {
            dispatch(clearProductDetails());
            clearTimeout(popoverTimer.current);
        };
    }, [dispatch, product_id]);

    useEffect(() => {
        if (details && details.id !== lastTrackedId.current) {
            trackProductView(details);
            lastTrackedId.current = details.id;
        }
    }, [details]);

    const incrementQuantity = () => setQuantity((q) => q + 1);
    const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

    const handleAddToCart = async () => {
        if (!details) return;
        trackAddToCart(details, quantity);
        await dispatch(addItemToCart(details.id, quantity));

        clearTimeout(popoverTimer.current);
        setPopover({ ...details, quantity });
        popoverTimer.current = setTimeout(() => setPopover(null), 3500);
    };

    const dismissPopover = () => {
        clearTimeout(popoverTimer.current);
        setPopover(null);
    };

    if (!details) {
        return (
            <div className="product-details-page loading-state">
                <p>Loading product details…</p>
            </div>
        );
    }

    const imageSrc = details.image?.url || details.thumbnail?.url;

    return (
        <div className="product-details-page">
            <div className="details-card image-card">
                {imageSrc ? (
                    <img src={imageSrc} alt={details.caption || details.name} />
                ) : (
                    <div className="image-fallback" aria-label="Image unavailable">
                        <p>Image unavailable</p>
                    </div>
                )}
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
                        <button className="btn-quantity" onClick={decrementQuantity}>
                            -
                        </button>
                        <span className="quantity">{quantity}</span>
                        <button className="btn-quantity" onClick={incrementQuantity}>
                            +
                        </button>
                    </div>
                </div>

                <div className="cta-row">
                    <button className="btn primary" onClick={handleAddToCart}>
                        Add to cart
                    </button>
                    <button className="btn brass" onClick={() => navigate("/contact")}>
                        Visit the cellar
                    </button>
                </div>
            </div>

            {/* Sticky bottom CTA — shown only on mobile via CSS */}
            <div className="product-sticky-cta">
                <div className="product-sticky-cta__price">
                    <span className="price"><Money cost={details.cost} /></span>
                    <p className="tiny">Incl. taxes</p>
                </div>
                <div className="product-sticky-cta__controls">
                    <div className="quantity-group" aria-label="Quantity selector">
                        <button className="btn-quantity" onClick={decrementQuantity}>−</button>
                        <span className="quantity">{quantity}</span>
                        <button className="btn-quantity" onClick={incrementQuantity}>+</button>
                    </div>
                    <button className="btn primary" onClick={handleAddToCart}>
                        Add to cart
                    </button>
                </div>
            </div>

            {popover && <CartPopover item={popover} onClose={dismissPopover} />}
        </div>
    );
};

export default ProductDetails;
