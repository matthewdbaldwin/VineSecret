import React, { useState } from 'react';
import './agegate.css';

const SESSION_KEY = 'vs_age_verified';

const AgeGate = () => {
    const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY));
    const [closing, setClosing] = useState(false);

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
        <div className={`age-gate${closing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-label="Age verification">
            <div className="age-gate__backdrop" />
            <div className="age-gate__content">
                <div className="age-gate__logo-mark" aria-hidden="true" />
                <p className="age-gate__eyebrow">Vine Secret Estate</p>
                <hr className="age-gate__rule" />
                <h1 className="age-gate__heading">You must be of<br />legal drinking age<br />to enter.</h1>
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
                    By entering you agree to our terms of use.<br />
                    Please drink responsibly.
                </p>
            </div>
        </div>
    );
};

export default AgeGate;
