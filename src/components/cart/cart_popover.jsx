import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Money from '../general/money';

const AUTO_DISMISS_MS = 3500;

const CartPopover = ({ item, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!item) return null;

    const lineTotal = (item.cost || 0) * (item.quantity || 1);

    return (
        <div className="cart-popover" role="status" aria-live="polite">
            <div className="cart-popover__header">
                <span className="cart-popover__check" aria-hidden="true">✓</span>
                <span className="cart-popover__title">Added to cart</span>
                <button className="cart-popover__close" onClick={onClose} aria-label="Dismiss notification" type="button">
                    ×
                </button>
            </div>
            <div className="cart-popover__body">
                <p className="cart-popover__name">{item.name}</p>
                <div className="cart-popover__meta">
                    <span>Qty: {item.quantity}</span>
                    <Money cost={lineTotal} />
                </div>
            </div>
            <Link className="cart-popover__cta" to="/cart" onClick={onClose}>
                View cart →
            </Link>
        </div>
    );
};

export default CartPopover;
