import React from "react";
import Money from "../general/money";
import "./products.css";

const ProductItem = ({ name, caption, cost, thumbnail, goToDetails }) => {
    return (
        <article className="product-card" onClick={goToDetails}>
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
                    <button className="btn ghost" type="button">
                        View details
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductItem;
