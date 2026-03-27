import React from 'react';
import './footer.css';
import { trackEmailClick } from '../../analytics/tracking';

const Footer = () => {
    const year = new Date().getFullYear();
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
            <p className="footer-copy">&copy; {year} VineSecret &mdash; All rights reserved</p>
        </footer>
    );
};

export default Footer;
