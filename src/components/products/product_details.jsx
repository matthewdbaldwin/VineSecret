import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addItemToCart, clearProductDetails, getProductDetails } from "../../actions/";
import { trackAddToCart, trackProductView } from "../../analytics/tracking";
import CartPopover from "../cart/cart_popover";
import Money from "../general/money";
import { varietalSlug, bottleTransitionName } from "../general/varietal";
import { proseWithGlossary } from "./glossary";
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
            <div className="vp-detail vp-detail--loading">
                <p>Loading product details…</p>
            </div>
        );
    }

    const imageSrc = details.image?.url || details.thumbnail?.url;
    const vintageMatch = (details.id || '').match(/-(\d{4})$/);
    const vintage = vintageMatch ? vintageMatch[1] : null;
    const { nodes, popovers } = proseWithGlossary(details.description);

    return (
        <article
            className="vp-detail"
            data-varietal={varietalSlug(details.type)}
        >
            <div className="vp-detail__poster">
                <div className="vp-detail__bottle-frame">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={details.caption || details.name}
                            className="vp-detail__bottle"
                            style={{ viewTransitionName: bottleTransitionName(details.id) }}
                        />
                    ) : (
                        <div className="image-fallback" aria-label="Image unavailable">
                            <p>Image unavailable</p>
                        </div>
                    )}
                </div>
                <header className="vp-detail__masthead">
                    <p className="eyebrow">
                        Estate release {vintage ? `· ${vintage}` : ''}
                    </p>
                    <h1 className="vp-detail__title">{details.name}</h1>
                    <p className="vp-detail__lede">{details.caption}</p>
                </header>
            </div>

            <section className="vp-detail__body">
                <div className="prose vp-detail__notes">
                    <p>
                        {nodes.map((node) => {
                            if (typeof node === 'string') return node;
                            return (
                                <button
                                    key={node.key}
                                    type="button"
                                    className="glossary-trigger"
                                    popoverTarget={node.popoverId}
                                    style={{ anchorName: node.anchorName }}
                                >
                                    {node.term}
                                </button>
                            );
                        })}
                    </p>
                </div>

                <aside className="vp-detail__aside">
                    <dl className="vp-detail__specs">
                        <dt>Vintage</dt>
                        <dd>{vintage || '—'}</dd>
                        <dt>Varietal</dt>
                        <dd>{details.type}</dd>
                        <dt>Format</dt>
                        <dd>750 ml</dd>
                        <dt>Drink window</dt>
                        <dd>Now through {vintage ? Number(vintage) + 8 : '—'}</dd>
                    </dl>

                    <div className="vp-detail__buy">
                        <div className="vp-detail__price">
                            <span className="price">
                                <Money cost={details.cost} />
                            </span>
                            <p className="tiny">Tax-inclusive · cold-pack shipping</p>
                        </div>
                        <div className="quantity-group" aria-label="Quantity selector">
                            <button className="btn-quantity" onClick={decrementQuantity} aria-label="Decrease quantity">−</button>
                            <span className="quantity">{quantity}</span>
                            <button className="btn-quantity" onClick={incrementQuantity} aria-label="Increase quantity">+</button>
                        </div>
                        <div className="vp-detail__cta">
                            <button className="btn primary" onClick={handleAddToCart}>
                                Add to cart
                            </button>
                            <button className="btn ghost-dark" onClick={() => navigate('/contact')}>
                                Visit the cellar
                            </button>
                        </div>
                    </div>
                </aside>
            </section>

            {popovers.map(({ popoverId, anchorName, term, definition }) => (
                <div
                    key={popoverId}
                    id={popoverId}
                    popover="auto"
                    className="glossary-popover"
                    style={{ positionAnchor: anchorName }}
                >
                    <p className="eyebrow">{term}</p>
                    <p>{definition}</p>
                </div>
            ))}

            {/* Sticky bottom CTA — mobile only via CSS */}
            <div className="product-sticky-cta">
                <div className="product-sticky-cta__price">
                    <span className="price"><Money cost={details.cost} /></span>
                    <p className="tiny">Incl. taxes</p>
                </div>
                <div className="product-sticky-cta__controls">
                    <div className="quantity-group" aria-label="Quantity selector">
                        <button className="btn-quantity" onClick={decrementQuantity} aria-label="Decrease quantity">−</button>
                        <span className="quantity">{quantity}</span>
                        <button className="btn-quantity" onClick={incrementQuantity} aria-label="Increase quantity">+</button>
                    </div>
                    <button className="btn primary" onClick={handleAddToCart}>
                        Add to cart
                    </button>
                </div>
            </div>

            {popover && <CartPopover item={popover} onClose={dismissPopover} />}
        </article>
    );
};

export default ProductDetails;
