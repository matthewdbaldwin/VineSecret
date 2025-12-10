import React from "react";
import Money from "../general/money";
import "./products.css";

const ProductItem = ({ name, caption, cost, thumbnail, type, goToDetails }) => {
    return (
        <article className="product-card" onClick={goToDetails}>
            <div className="product-card__header">
                <span className="eyebrow">Estate release</span>
                <span className="pill">{type}</span>
            </div>
            <div className="product-card__image">
                <img src={thumbnail.url} alt={`${name} bottle`} />
            </div>
            <div className="product-card__body">
                <h3>{name}</h3>
                <p className="caption">{caption}</p>
                <div className="product-card__footer">
                    <div>
                        <span className="price">
                            <Money cost={cost} />
                        </span>
                        <p className="tiny">{type} • tax-inclusive, temp-controlled shipping.</p>
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
