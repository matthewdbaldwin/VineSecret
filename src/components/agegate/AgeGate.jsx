import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './agegate.css';

const SESSION_KEY = 'vs_age_verified';

const AgeGate = () => {
    const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY));
    const [closing, setClosing] = useState(false);
    const trapRef = useFocusTrap(visible);

    useEffect(() => {
        if (visible) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [visible]);

    const handleEnter = () => {
        setClosing(true);
        sessionStorage.setItem(SESSION_KEY, '1');
        setTimeout(() => setVisible(false), 600);
    };

    const handleDecline = () => {
        window.location.href = 'https://www.responsibility.org/';
    };

    if (!visible) return null;

    return (
        <div
            className={`age-gate${closing ? ' is-closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-gate-heading"
        >
            <div className="age-gate__backdrop" />
            <div className="age-gate__content" ref={trapRef}>
                <div className="age-gate__logo-mark" aria-hidden="true" />
                <p className="age-gate__eyebrow">Vine Secret Estate</p>
                <hr className="age-gate__rule" />
                <h1 id="age-gate-heading" className="age-gate__heading">You must be of<br />legal drinking age<br />to enter.</h1>
                <p className="age-gate__sub">Are you 21 years of age or older?</p>
                <div className="age-gate__actions">
                    <button className="age-gate__btn age-gate__btn--yes" onClick={handleEnter}>
                        Yes, enter
                    </button>
                    <button className="age-gate__btn age-gate__btn--no" onClick={handleDecline}>
                        No
                    </button>
                </div>
                <p className="age-gate__legal">
                    By entering you agree to our <Link to="/legal/terms" onClick={handleEnter}>terms of use</Link>.<br />
                    Please drink responsibly.
                </p>
            </div>
        </div>
    );
};

export default AgeGate;
