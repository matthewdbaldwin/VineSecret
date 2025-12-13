import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getActiveCart, updateLocalCartItem } from '../../actions';
import Money from '../general/money';
import './cart.css';

const Cart = ({ cart, getActiveCart: loadCart, updateLocalCartItem: updateItem, history }) => {
    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const items = cart?.items || [];
    const totals = cart?.total;

    const handleIncrement = (id, currentQuantity) => updateItem(id, currentQuantity + 1);
    const handleDecrement = (id, currentQuantity) => updateItem(id, Math.max(0, currentQuantity - 1));
    const handleRemove = (id) => updateItem(id, 0);

    const goToCheckout = () => {
        history.push('/contact');
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
                        {items.map((item) => (
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
                                        <button className="text-link" type="button" onClick={() => handleRemove(item.id)}>
                                            Remove
                                        </button>
                                    </div>
                                    <div className="cart-card__footer">
                                        <div className="quantity-group" aria-label={`Quantity for ${item.name}`}>
                                            <button className="btn-quantity" onClick={() => handleDecrement(item.id, item.quantity)}>
                                                -
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button className="btn-quantity" onClick={() => handleIncrement(item.id, item.quantity)}>
                                                +
                                            </button>
                                        </div>
                                        <div className="line-price" aria-label="Line total">
                                            <Money cost={item.lineTotal} />
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
                                <Money cost={totals?.subtotal} />
                            </div>
                            <div className="summary-row">
                                <div className="summary-label">
                                    <span>Shipping</span>
                                    {totals?.shipping === 0 && <span className="note">Included with 3+ bottles</span>}
                                </div>
                                <Money cost={totals?.shipping} />
                            </div>
                            <div className="summary-row">
                                <span>Estimated tax</span>
                                <Money cost={totals?.tax} />
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <Money cost={totals?.grandTotal} />
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
