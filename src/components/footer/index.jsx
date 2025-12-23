import React from 'react';
import './footer.css';
import { trackEmailClick } from '../../analytics/tracking';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="site-footer">
            <div className="footer-grid">
                <div className="footer-block">
                    <p className="label">Tasting room</p>
                    <p>Orange County, CA</p>
                </div>
                <div className="footer-block">
                    <p className="label">Contact</p>
                    <p>
                        800-264-2099<br />
                        <a href="mailto:order@vinesecret.com" onClick={() => trackEmailClick('footer_email', 'order@vinesecret.com')}>
                            order@vinesecret.com
                        </a>
                    </p>
                </div>
                <div className="footer-block">
                    <p className="label">Copyright</p>
                    <p>&copy; {year} VineSecret</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
