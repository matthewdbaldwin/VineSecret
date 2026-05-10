import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Money from '../general/money';

const AUTO_DISMISS_MS = 3500;

const CartPopover = ({ item, onClose }) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (el && typeof el.showPopover === 'function' && !el.matches(':popover-open')) {
            try { el.showPopover(); } catch { /* already open or unsupported */ }
        }
        const timer = setTimeout(() => onClose(), AUTO_DISMISS_MS);
        return () => {
            clearTimeout(timer);
            if (el && typeof el.hidePopover === 'function' && el.matches(':popover-open')) {
                try { el.hidePopover(); } catch { /* unsupported */ }
            }
        };
    }, [onClose]);

    if (!item) return null;

    const lineTotal = (item.cost || 0) * (item.quantity || 1);

    return (
        <div
            ref={ref}
            className="cart-popover"
            popover="manual"
            role="status"
            aria-live="polite"
        >
            <div className="cart-popover__header">
                <span className="cart-popover__check" aria-hidden="true">✓</span>
                <span className="cart-popover__title">Added to cart</span>
                <button
                    className="cart-popover__close"
                    onClick={onClose}
                    aria-label="Dismiss notification"
                    type="button"
                >
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
