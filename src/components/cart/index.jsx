import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getActiveCart, updateLocalCartItem } from '../../actions';
import { trackBeginCheckout, trackCartUpdate, trackCartView } from '../../analytics/tracking';
import { findProductById } from '../../data/products';
import Money from '../general/money';
import './cart.css';

const Cart = ({ cart, getActiveCart: loadCart, updateLocalCartItem: updateItem, history }) => {
    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const items = cart?.items || [];
    const totals = cart?.total;

    const derivedTotals = useMemo(() => {
        const subtotal = items.reduce(
            (total, item) => total + ((item.lineTotal ?? ((item.cost || 0) * (item.quantity || 0)))),
            0,
        );
        const bottleCount = items.reduce((total, item) => total + (item.quantity || 0), 0);
        const shipping = bottleCount >= 3 || subtotal === 0 ? 0 : 1500;
        const tax = Math.round(subtotal * 0.085);
        const grandTotal = subtotal + shipping + tax;

        return { subtotal, shipping, tax, grandTotal };
    }, [items]);

    const displayTotals = totals ?? derivedTotals;

    useEffect(() => {
        trackCartView({ items, total: displayTotals });
    }, [items, displayTotals]);

    const handleIncrement = (item) => {
        const nextQuantity = item.quantity + 1;
        trackCartUpdate(item, nextQuantity, 'increment');
        updateItem(item.id, nextQuantity);
    };

    const handleDecrement = (item) => {
        const nextQuantity = Math.max(0, item.quantity - 1);
        trackCartUpdate(item, nextQuantity, 'decrement');
        updateItem(item.id, nextQuantity);
    };

    const handleRemove = (item) => {
        trackCartUpdate(item, 0, 'remove');
        updateItem(item.id, 0);
    };

    const goToCheckout = () => {
        trackBeginCheckout({ items, total: displayTotals });
        history.push('/checkout');
    };

    return (
        <div className="cart-page">
            <div className="cart-hero">
                <div>
                    <p className="eyebrow">Cellar box</p>
                    <h1>Your bottles, ready to ship.</h1>
                    <p className="lede">
                        Review your selections, adjust quantities, and secure temperature-controlled shipping.
                    </p>
                </div>
                <div className="cart-hero__actions">
                    <Link className="btn ghost" to="/products">
                        Continue browsing wines
                    </Link>
                    <button className="btn primary" type="button" onClick={goToCheckout} disabled={!items.length}>
                        Proceed to checkout
                    </button>
                </div>
            </div>

            {!items.length ? (
                <div className="cart-empty">
                    <h3>Your cellar is empty.</h3>
                    <p>
                        Explore the latest releases and reserve bottles before they disappear. Cold pack shipping is
                        complimentary on 3+ bottle orders.
                    </p>
                    <Link className="btn primary" to="/products">
                        Shop the collection
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <section className="cart-items" aria-label="Cart items">
                        {pricedItems.map((item) => (
                            <article key={item.id} className="cart-card">
                                <div className="cart-card__image">
                                    <img src={item.thumbnail?.url || item.image?.url} alt={item.caption || item.name} />
                                </div>
                                <div className="cart-card__body">
                                    <div className="cart-card__header">
                                        <div>
                                            <p className="eyebrow">Estate release</p>
                                            <h3>{item.name}</h3>
                                            <p className="caption">{item.caption}</p>
                                        </div>
                                        <button className="text-link" type="button" onClick={() => handleRemove(item)}>
                                            Remove
                                        </button>
                                    </div>
                                    <div className="cart-card__footer">
                                        <div className="quantity-group" aria-label={`Quantity for ${item.name}`}>
                                            <button className="btn-quantity" onClick={() => handleDecrement(item)}>
                                                -
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button className="btn-quantity" onClick={() => handleIncrement(item)}>
                                                +
                                            </button>
                                        </div>
                                            <div className="line-price" aria-label="Line total">
                                                <Money cost={item.lineTotal ?? (item.cost || 0) * (item.quantity || 0)} />
                                            </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    <aside className="cart-summary" aria-label="Order summary">
                        <div className="summary-card">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <Money cost={displayTotals?.subtotal} />
                            </div>
                            <div className="summary-row">
                                <div className="summary-label">
                                    <span>Shipping</span>
                                {displayTotals?.shipping === 0 && <span className="note">Included with 3+ bottles</span>}
                            </div>
                            <Money cost={displayTotals?.shipping} />
                        </div>
                        <div className="summary-row">
                            <span>Estimated tax</span>
                            <Money cost={displayTotals?.tax} />
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <Money cost={displayTotals?.grandTotal} />
                        </div>
                        </div>
                        <div className="summary-actions">
                            <button className="btn primary" type="button" onClick={goToCheckout}>
                                Checkout as guest
                            </button>
                            <p className="tiny">We’ll confirm your order and shipping preferences on the next step.</p>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

function mapStateToProps(state) {
    return {
        cart: state.cart,
    };
}

export default connect(mapStateToProps, { getActiveCart, updateLocalCartItem })(Cart);
