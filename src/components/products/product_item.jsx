import React from "react";
import Money from "../general/money";
import "./products.css";

const ProductItem = ({ name, caption, cost, thumbnail, goToDetails, onAddToCart }) => {
    const handleCardClick = () => {
        goToDetails();
    };

    const handleViewDetails = (event) => {
        event.stopPropagation();
        goToDetails();
    };

    const handleAddToCart = (event) => {
        event.stopPropagation();
        onAddToCart?.();
    };

    return (
        <article className="product-card" onClick={handleCardClick}>
            <div className="product-card__header">
                <span className="eyebrow">Estate release</span>
                <span className="pill">Limited</span>
            </div>
            <div className="product-card__image">
                <img src={thumbnail.url} alt={caption || name} />
            </div>
            <div className="product-card__body">
                <h3>{name}</h3>
                <p className="caption">{caption}</p>
                <div className="product-card__footer">
                    <div>
                        <span className="price">
                            <Money cost={cost} />
                        </span>
                        <p className="tiny">Tax-inclusive, ships temp-controlled.</p>
                    </div>
                    <div className="product-card__actions">
                        <button className="btn ghost" type="button" onClick={handleViewDetails}>
                            View details
                        </button>
                        <button className="btn primary" type="button" onClick={handleAddToCart}>
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductItem;
