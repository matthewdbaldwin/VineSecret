import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createGuestOrder, getActiveCart } from '../../actions';
import { findProductById } from '../../data/products';
import { trackBeginCheckout, trackCheckoutStep, trackPurchase } from '../../analytics/tracking';
import Money from '../general/money';
import './checkout.css';

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postal: '',
    notes: '',
};

const STEP_FIELDS = {
    1: ['firstName', 'lastName', 'email'],
    2: ['address', 'city', 'region', 'postal'],
};

const useIsMobileWizard = () => {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
    );
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
};

const Checkout = ({ cart, createGuestOrder: submitGuestOrder, getActiveCart: loadCart }) => {
    const [formValues, setFormValues] = useState(EMPTY_FORM);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [step, setStep] = useState(1);
    const isMobileWizard = useIsMobileWizard();

    const items = cart?.items || [];
    const totals = cart?.total;

    const pricedItems = useMemo(
        () =>
            items.map((item) => {
                const fallback = findProductById(item.id) || {};
                const cost = item.cost ?? fallback.cost ?? 0;
                const quantity = item.quantity || 0;
                const lineTotal = item.lineTotal ?? cost * quantity;

                return {
                    ...fallback,
                    ...item,
                    cost,
                    quantity,
                    lineTotal,
                };
            }),
        [items],
    );

    const displayTotals = useMemo(() => {
        const subtotal = pricedItems.reduce((total, item) => total + item.lineTotal, 0);
        const bottleCount = pricedItems.reduce((total, item) => total + (item.quantity || 0), 0);
        const fallbackShipping = bottleCount >= 3 || subtotal === 0 ? 0 : 1500;
        const fallbackTax = Math.round(subtotal * 0.085);

        const shipping =
            typeof totals?.shipping === 'number'
                ? totals.shipping === 0 && fallbackShipping > 0
                    ? fallbackShipping
                    : totals.shipping
                : fallbackShipping;

        return {
            subtotal: totals?.subtotal && totals.subtotal > 0 ? totals.subtotal : subtotal,
            shipping,
            tax: totals?.tax && totals.tax > 0 ? totals.tax : fallbackTax,
            grandTotal:
                totals?.grandTotal && totals.grandTotal > 0
                    ? totals.grandTotal
                    : subtotal + shipping + fallbackTax,
        };
    }, [pricedItems, totals]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    useEffect(() => {
        if (pricedItems.length && !confirmation) {
            trackBeginCheckout({ items: pricedItems, total: displayTotals }, 'checkout_page');
            trackCheckoutStep('checkout_view', { items: pricedItems, total: displayTotals });
        }
    }, [pricedItems, displayTotals, confirmation]);

    const fullName = useMemo(
        () => `${formValues.firstName} ${formValues.lastName}`.trim() || 'Guest',
        [formValues.firstName, formValues.lastName],
    );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const nextErrors = {};
        if (!formValues.firstName.trim()) nextErrors.firstName = 'First name is required';
        if (!formValues.lastName.trim()) nextErrors.lastName = 'Last name is required';
        if (!formValues.email.trim()) nextErrors.email = 'Email is required';
        if (!formValues.address.trim()) nextErrors.address = 'Address is required';
        if (!formValues.city.trim()) nextErrors.city = 'City is required';
        if (!formValues.region.trim()) nextErrors.region = 'State/Province is required';
        if (!formValues.postal.trim()) nextErrors.postal = 'Postal code is required';
        return nextErrors;
    };

    const validateStep = (currentStep) => {
        const nextErrors = {};
        if (currentStep === 1) {
            if (!formValues.firstName.trim()) nextErrors.firstName = 'First name is required';
            if (!formValues.lastName.trim()) nextErrors.lastName = 'Last name is required';
            if (!formValues.email.trim()) nextErrors.email = 'Email is required';
        }
        if (currentStep === 2) {
            if (!formValues.address.trim()) nextErrors.address = 'Address is required';
            if (!formValues.city.trim()) nextErrors.city = 'City is required';
            if (!formValues.region.trim()) nextErrors.region = 'State/Province is required';
            if (!formValues.postal.trim()) nextErrors.postal = 'Postal code is required';
        }
        return nextErrors;
    };

    const handleNextStep = () => {
        const stepErrors = validateStep(step);
        setErrors(stepErrors);
        if (!Object.keys(stepErrors).length) {
            setStep((s) => s + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevStep = () => {
        setErrors({});
        setStep((s) => s - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validation = validate();
        setErrors(validation);
        if (Object.keys(validation).length) return;

        trackCheckoutStep('checkout_submit', { items: pricedItems, total: displayTotals });
        setSubmitting(true);
        const cartSnapshot = { items: pricedItems, total: displayTotals };
        const response = await submitGuestOrder({
            ...formValues,
            shippingMethod,
        });

        setConfirmation({
            orderId: response?.orderId || 'pending',
            email: response?.email || formValues.email,
            message: response?.message || 'Order received. A confirmation email is on the way.',
            cart: response?.cart || cartSnapshot,
            name: fullName,
            emailSent: response?.emailSent || false,
        });
        setSubmitting(false);
        setFormValues(EMPTY_FORM);
    };

    useEffect(() => {
        if (confirmation) {
            trackPurchase({ ...confirmation, cart: confirmation.cart || { items: pricedItems, total: displayTotals } });
        }
    }, [confirmation, displayTotals, pricedItems]);

    const renderLineItems = (lineItems) => (
        <div className="line-items">
            {lineItems.map((item) => (
                <div key={item.id} className="line-item">
                    <div>
                        <p className="eyebrow">x{item.quantity}</p>
                        <p className="line-name">{item.name}</p>
                        <p className="caption">{item.caption}</p>
                    </div>
                    <Money cost={item.lineTotal} />
                </div>
            ))}
        </div>
    );

    const renderShippingPanel = () => (
        <div className="wizard-panel">
            {isMobileWizard && <h3 className="step-title">Shipping details</h3>}
            {!isMobileWizard && <h4>Shipping</h4>}
            <div className="form-grid">
                <div className={errors.address ? 'input-field has-error' : 'input-field'}>
                    <label htmlFor="address">Address</label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={formValues.address}
                        onChange={handleChange}
                        autoComplete="street-address"
                    />
                    {errors.address && <p className="error">{errors.address}</p>}
                </div>
            </div>
            <div className="form-grid form-grid--thirds">
                <div className={errors.city ? 'input-field has-error' : 'input-field'}>
                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        value={formValues.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                    />
                    {errors.city && <p className="error">{errors.city}</p>}
                </div>
                <div className={errors.region ? 'input-field has-error' : 'input-field'}>
                    <label htmlFor="region">State/Province</label>
                    <input
                        id="region"
                        name="region"
                        type="text"
                        value={formValues.region}
                        onChange={handleChange}
                        autoComplete="address-level1"
                    />
                    {errors.region && <p className="error">{errors.region}</p>}
                </div>
                <div className={errors.postal ? 'input-field has-error' : 'input-field'}>
                    <label htmlFor="postal">Postal code</label>
                    <input
                        id="postal"
                        name="postal"
                        type="text"
                        value={formValues.postal}
                        onChange={handleChange}
                        autoComplete="postal-code"
                    />
                    {errors.postal && <p className="error">{errors.postal}</p>}
                </div>
            </div>
            <div className="form-grid">
                <div className="input-field">
                    <label htmlFor="notes">Delivery notes (optional)</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="3"
                        value={formValues.notes}
                        onChange={handleChange}
                        placeholder="Gate codes, preferred delivery times, etc."
                    />
                </div>
            </div>
            {isMobileWizard && <h3 className="step-title">Shipping method</h3>}
            {!isMobileWizard && <h4>Shipping method</h4>}
            <div className="radio-group">
                <label className={shippingMethod === 'standard' ? 'radio-card is-selected' : 'radio-card'}>
                    <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                    />
                    <div>
                        <p className="radio-title">Standard temperature-controlled</p>
                        <p className="caption">Included with 3+ bottles. Arrives in 3–5 business days.</p>
                    </div>
                </label>
                <label className={shippingMethod === 'express' ? 'radio-card is-selected' : 'radio-card'}>
                    <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                    />
                    <div>
                        <p className="radio-title">Express cold pack</p>
                        <p className="caption">Priority handling with insulated packaging.</p>
                    </div>
                </label>
            </div>
            {isMobileWizard && (
                <div className="form-actions wizard-actions">
                    <button className="btn ghost" type="button" onClick={handlePrevStep}>
                        Back
                    </button>
                    <button className="btn primary" type="button" onClick={handleNextStep}>
                        Review order
                    </button>
                </div>
            )}
        </div>
    );

    const renderReviewPanel = () => (
        <div className="wizard-panel">
            <h3 className="step-title">Review your order</h3>
            <div className="review-section">
                <p className="review-label">Contact</p>
                <p className="review-value">{formValues.firstName} {formValues.lastName}</p>
                <p className="review-value">{formValues.email}</p>
                {formValues.phone && <p className="review-value">{formValues.phone}</p>}
                <button className="review-edit" type="button" onClick={() => { setStep(1); setErrors({}); }}>Edit</button>
            </div>
            <div className="review-section">
                <p className="review-label">Ship to</p>
                <p className="review-value">{formValues.address}</p>
                <p className="review-value">{formValues.city}, {formValues.region} {formValues.postal}</p>
                <p className="review-value">{shippingMethod === 'express' ? 'Express cold pack' : 'Standard temperature-controlled'}</p>
                <button className="review-edit" type="button" onClick={() => { setStep(2); setErrors({}); }}>Edit</button>
            </div>
            <div className="form-actions wizard-actions">
                <button className="btn ghost" type="button" onClick={handlePrevStep}>
                    Back
                </button>
                <button className="btn primary" type="submit" disabled={submitting}>
                    {submitting ? 'Placing order…' : 'Place order'}
                </button>
            </div>
        </div>
    );

    if (!items.length && !confirmation) {
        return (
            <section className="checkout">
                <div className="checkout-inner">
                    <div className="checkout-empty">
                        <h2>Your cart is empty</h2>
                        <p>Browse the collection to add bottles before completing checkout.</p>
                        <div className="checkout-empty__actions">
                            <Link className="btn primary" to="/products">
                                Shop wines
                            </Link>
                            <Link className="btn ghost" to="/cart">
                                Go to cart
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="checkout">
            <div className="checkout-inner">
                <header className="checkout-header">
                    <div>
                        <p className="eyebrow">{confirmation ? 'Order placed' : 'Checkout'}</p>
                        <h1>{confirmation ? 'Guest order confirmed' : 'Secure your shipment'}</h1>
                        <p className="lede">
                            {confirmation
                                ? 'We saved a copy of your order locally. Expect a confirmation email shortly.'
                                : 'Complete your details for a streamlined, guest-only checkout. No account required.'}
                        </p>
                    </div>
                    {!confirmation && (
                        <div className="header-actions">
                            <Link className="btn ghost" to="/cart">
                                Edit cart
                            </Link>
                            <Link className="btn primary" to="/products">
                                Add more wines
                            </Link>
                        </div>
                    )}
                </header>

                <div className="checkout-grid">
                    <div className="checkout-card">
                        {!confirmation ? (
                            <form className="checkout-form" onSubmit={handleSubmit}>
                                {/* Mobile wizard step indicator */}
                                {isMobileWizard && (
                                    <div className="wizard-progress" aria-label="Checkout progress">
                                        {['Contact', 'Shipping', 'Review'].map((label, i) => {
                                            const dotClass = [
                                                'wizard-step-dot',
                                                step === i + 1 && 'is-active',
                                                step > i + 1 && 'is-done',
                                            ].filter(Boolean).join(' ');
                                            return (
                                                <div key={label} className={dotClass}>
                                                    <span className="dot" />
                                                    <span className="dot-label">{label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Step 1: Contact */}
                                {(!isMobileWizard || step === 1) && (
                                <div className="wizard-panel">
                                {isMobileWizard && <h3 className="step-title">Contact details</h3>}
                                {!isMobileWizard && <h3>Guest details</h3>}
                                <div className="form-grid">
                                    <div className={errors.firstName ? 'input-field has-error' : 'input-field'}>
                                        <label htmlFor="firstName">First name</label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={formValues.firstName}
                                            onChange={handleChange}
                                            autoComplete="given-name"
                                        />
                                        {errors.firstName && <p className="error">{errors.firstName}</p>}
                                    </div>
                                    <div className={errors.lastName ? 'input-field has-error' : 'input-field'}>
                                        <label htmlFor="lastName">Last name</label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={formValues.lastName}
                                            onChange={handleChange}
                                            autoComplete="family-name"
                                        />
                                        {errors.lastName && <p className="error">{errors.lastName}</p>}
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className={errors.email ? 'input-field has-error' : 'input-field'}>
                                        <label htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formValues.email}
                                            onChange={handleChange}
                                            autoComplete="email"
                                        />
                                        {errors.email && <p className="error">{errors.email}</p>}
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="phone">Phone (optional)</label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formValues.phone}
                                            onChange={handleChange}
                                            autoComplete="tel"
                                        />
                                    </div>
                                </div>
                                {/* Mobile wizard: Next button for step 1 */}
                                {isMobileWizard && (
                                    <div className="form-actions">
                                        <button className="btn primary" type="button" onClick={handleNextStep}>
                                            Continue to shipping
                                        </button>
                                    </div>
                                )}
                                </div>
                                )}

                                {/* Steps 2 & 3 rendered via functions to avoid esbuild scanner issues with deep JSX nesting */}
                                {(!isMobileWizard || step === 2) && renderShippingPanel()}
                                {isMobileWizard && step === 3 && renderReviewPanel()}

                                {/* Desktop: always-visible submit */}
                                {!isMobileWizard && (
                                <div className="form-actions">
                                    <button className="btn primary" type="submit" disabled={submitting}>
                                        {submitting ? 'Placing order\u2026' : 'Place order as guest'}
                                    </button>
                                    <span className="tiny">No account needed. We’ll never share your email.</span>
                                </div>
                                )}
                            </form>
                        ) : (
                            <div className="confirmation">
                                <h3>Thank you, {confirmation.name}.</h3>
                                <p className="lede">{confirmation.message}</p>
                                <div className="confirmation-meta">
                                    <div>
                                        <p className="eyebrow">Order ID</p>
                                        <p className="strong">{confirmation.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="eyebrow">Email</p>
                                        <p className="strong">{confirmation.email}</p>
                                    </div>
                                </div>
                                <p className="tiny">
                                    {confirmation.emailSent
                                        ? 'We emailed your receipt and tracking details. If you do not see it, please check your spam folder.'
                                        : 'We saved your receipt locally in case we could not send the email automatically.'}
                                </p>
                                <div className="confirmation-actions">
                                    <Link className="btn primary" to="/products">
                                        Continue shopping
                                    </Link>
                                    <Link className="btn ghost" to="/">
                                        Back to home
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="checkout-summary">
                        <div className="summary-card">
                            <div className="summary-header">
                                <div>
                                    <p className="eyebrow">Order summary</p>
                                    <h3>{confirmation ? 'Saved receipt' : 'Current cart'}</h3>
                                </div>
                                <span className="pill soft">Cold pack shipping</span>
                            </div>
                            {renderLineItems(confirmation?.cart?.items || pricedItems)}
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <Money cost={(confirmation?.cart?.total || displayTotals)?.subtotal} />
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <Money cost={(confirmation?.cart?.total || displayTotals)?.shipping} />
                            </div>
                            <div className="summary-row">
                                <span>Estimated tax</span>
                                <Money cost={(confirmation?.cart?.total || displayTotals)?.tax} />
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <Money cost={(confirmation?.cart?.total || displayTotals)?.grandTotal} />
                            </div>
                            {!confirmation && (
                                <p className="tiny">
                                    Totals update automatically as you change quantities in your cart. Shipping adjusts for cold
                                    packs and bottle count.
                                </p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

function mapStateToProps(state) {
    return {
        cart: state.cart,
    };
}

export default connect(mapStateToProps, { createGuestOrder, getActiveCart })(Checkout);
