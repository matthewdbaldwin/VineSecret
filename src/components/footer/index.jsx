import React from 'react';
import './footer.css';

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
                    <p>800-264-2099<br />order@vinesecret.com</p>
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
