import React, { useState } from 'react';
import { trackEngagement } from '../../analytics/tracking';
import './club.css';

const TIERS = [
    {
        id: 'explorer',
        name: 'The Explorer',
        bottles: 3,
        frequency: 'quarterly',
        price: 9600,
        perks: [
            'Curated 3-bottle mixed discovery shipment',
            'Winemaker tasting notes with each allocation',
            'Early access to limited releases',
        ],
    },
    {
        id: 'enthusiast',
        name: 'The Enthusiast',
        bottles: 6,
        frequency: 'quarterly',
        price: 19200,
        perks: [
            'Curated 6-bottle shipment — reds, whites, or mixed',
            'Complimentary cold-pack shipping every quarter',
            'Priority access to sold-out vintages',
            'Invitation to quarterly cellar events',
        ],
        featured: true,
    },
    {
        id: 'collector',
        name: 'The Collector',
        bottles: 12,
        frequency: 'quarterly',
        price: 36800,
        perks: [
            'Full 12-bottle allocation — the complete release',
            'Dedicated cellar concierge for vertical planning',
            'Private tasting for two each quarter',
            'First allocation on every new vintage',
            'Monogrammed wine key and library access',
        ],
    },
];

const PREFERENCES = [
    { value: 'mixed', label: 'Mixed — surprise me' },
    { value: 'reds', label: 'Reds only' },
    { value: 'whites', label: 'Whites only' },
    { value: 'no-preference', label: 'No preference' },
];

const EMPTY_FORM = { name: '', email: '', phone: '', preference: 'mixed', notes: '' };

const WineClub = () => {
    const [selectedTier, setSelectedTier] = useState('enthusiast');
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setSubmitting(true);
        trackEngagement('club_signup_submit', selectedTier);

        try {
            await fetch('/api/club/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, tier: selectedTier }),
            });
        } catch (_) {
            // demo: show success regardless
        }

        setSuccess(true);
        setSubmitting(false);
    };

    const tier = TIERS.find((t) => t.id === selectedTier);

    if (success) {
        return (
            <section className="club">
                <div className="club-inner">
                    <div className="club-success">
                        <p className="eyebrow">You're on the list</p>
                        <h1>Welcome to VineSecret.</h1>
                        <p className="club-success__lede">
                            We'll reach out within one business day to confirm your membership in <strong>{tier?.name}</strong> and arrange your first shipment.
                        </p>
                        <p className="tiny">
                            Questions? Call the cellar at 800-264-2099 or email <a href="mailto:club@vinesecret.com">club@vinesecret.com</a>.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="club">
            <div className="club-inner">
                <header className="club-hero">
                    <div>
                        <p className="eyebrow">Wine club</p>
                        <h1>Allocations delivered to your cellar.</h1>
                        <p className="lede">
                            Four times a year, we curate a shipment from the estate — built around the best bottles
                            from the current release. Members get early access, private events, and a direct line to the people who made the wine.
                        </p>
                        <ul className="club-highlights">
                            <li>Complimentary cold-pack shipping on all allocations</li>
                            <li>Priority access before public release</li>
                            <li>Cancel or pause anytime, no fees</li>
                        </ul>
                    </div>
                </header>

                <div className="tier-grid">
                    {TIERS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            className={`tier-card${selectedTier === t.id ? ' is-selected' : ''}${t.featured ? ' is-featured' : ''}`}
                            onClick={() => { setSelectedTier(t.id); trackEngagement('club_tier_select', t.id); }}
                            aria-pressed={selectedTier === t.id}
                        >
                            {t.featured && <span className="tier-badge">Most popular</span>}
                            <p className="tier-name">{t.name}</p>
                            <p className="tier-bottles">{t.bottles} bottles / {t.frequency}</p>
                            <p className="tier-price">
                                ${(t.price / 100).toFixed(0)}
                                <span className="tier-per"> per shipment</span>
                            </p>
                            <ul className="tier-perks">
                                {t.perks.map((perk) => (
                                    <li key={perk}>{perk}</li>
                                ))}
                            </ul>
                        </button>
                    ))}
                </div>

                <div className="club-form-wrap">
                    <div className="club-form-card">
                        <p className="eyebrow">Join {tier?.name}</p>
                        <h2>Reserve your allocation.</h2>
                        <p className="lede">
                            We'll confirm your membership by email and set up your first shipment.
                            No payment taken until your first allocation ships.
                        </p>
                        <form className="club-form" onSubmit={handleSubmit} noValidate>
                            <div className="form-grid">
                                <div className={errors.name ? 'input-field has-error' : 'input-field'}>
                                    <label htmlFor="club-name">Full name</label>
                                    <input
                                        id="club-name"
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                    />
                                    {errors.name && <p className="error">{errors.name}</p>}
                                </div>
                                <div className={errors.email ? 'input-field has-error' : 'input-field'}>
                                    <label htmlFor="club-email">Email</label>
                                    <input
                                        id="club-email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                    {errors.email && <p className="error">{errors.email}</p>}
                                </div>
                                <div className="input-field">
                                    <label htmlFor="club-phone">Phone (optional)</label>
                                    <input
                                        id="club-phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        autoComplete="tel"
                                    />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="club-preference">Wine preference</label>
                                    <select
                                        id="club-preference"
                                        name="preference"
                                        value={form.preference}
                                        onChange={handleChange}
                                    >
                                        {PREFERENCES.map((p) => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="input-field">
                                <label htmlFor="club-notes">Notes (optional)</label>
                                <textarea
                                    id="club-notes"
                                    name="notes"
                                    rows="3"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Dietary restrictions, gifting notes, preferred delivery times…"
                                />
                            </div>
                            <div className="form-actions">
                                <button className="btn primary" type="submit" disabled={submitting}>
                                    {submitting ? 'Reserving…' : 'Reserve my spot'}
                                </button>
                                <span className="tiny">No payment until your first shipment. Cancel anytime.</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WineClub;
