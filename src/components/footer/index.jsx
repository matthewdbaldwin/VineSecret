import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './footer.css';
import { trackEmailClick } from '../../analytics/tracking';

const Footer = () => {
    const year = new Date().getFullYear();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const triggerRef = useRef(null);
    const popoverRef = useFocusTrap(popoverOpen);

    const closePopover = () => {
        setPopoverOpen(false);
        triggerRef.current?.focus();
    };

    useEffect(() => {
        if (!popoverOpen) return;
        const handleKey = (e) => { if (e.key === 'Escape') closePopover(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [popoverOpen]);

    return (
        <footer className="site-footer">
            <div className="footer-grid">
                <div className="footer-block">
                    <span className="label">Tasting Room</span>
                    <p>Orange County, CA</p>
                </div>
                <div className="footer-block">
                    <span className="label">Contact</span>
                    <p>
                        800-264-2099<br />
                        <a href="mailto:order@vinesecret.com" onClick={() => trackEmailClick('footer_email', 'order@vinesecret.com')}>
                            order@vinesecret.com
                        </a>
                    </p>
                </div>
                <div className="footer-block">
                    <span className="label">Estate</span>
                    <p>Vine Secret Winery<br />Est. California</p>
                </div>
            </div>
            <p className="footer-copy">
                &copy; {year} VineSecret &mdash; All rights reserved
                <span className="footer-copy__sep">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <Link className="footer-legal-link" to="/legal/terms">Terms of Use</Link>
                <span className="footer-copy__sep">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <Link className="footer-legal-link" to="/legal/privacy">Privacy Policy</Link>
                <span className="footer-copy__sep">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <button
                    ref={triggerRef}
                    className="dnsmpi-btn"
                    onClick={() => setPopoverOpen(true)}
                    aria-haspopup="dialog"
                >
                    Do Not Sell My Information
                </button>
            </p>

            {popoverOpen && (
                <div
                    className="dnsmpi-overlay"
                    onClick={closePopover}
                    role="presentation"
                >
                    <div
                        ref={popoverRef}
                        className="dnsmpi-popover"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dnsmpi-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p id="dnsmpi-title" className="dnsmpi-popover__title">Do Not Sell My Information</p>
                        <p>This is a demonstration website. No personal information is collected, stored, sold, or shared with any third party. Any data you enter during checkout exists only in your browser&rsquo;s local storage and is never transmitted to or retained by any external service.</p>
                        <button className="btn primary" onClick={closePopover}>Got it</button>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;
