import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './legal.css';

const TERMS = (
    <>
        <h1>Terms of Use</h1>
        <p className="legal-effective">Effective: January 1, 2025</p>

        <h2>1. Demonstration Site</h2>
        <p>VineSecret (<em>vinesecret.com</em>) is a demonstration website. No real products are sold, no payments are processed, and no orders are fulfilled. Any information you enter is not stored on a persistent server and is not used for any commercial purpose.</p>

        <h2>2. Age Requirement</h2>
        <p>This site depicts alcoholic beverages. By entering, you confirm that you are 21 years of age or older, or the legal drinking age in your jurisdiction, whichever is greater. If you are not of legal drinking age, please exit immediately.</p>

        <h2>3. No Warranties</h2>
        <p>This site is provided "as is" without warranties of any kind. We make no representations about the accuracy or completeness of any content on this site.</p>

        <h2>4. Intellectual Property</h2>
        <p>All content on this site, including text, images, and design, is the property of VineSecret or its licensors. You may not reproduce or distribute any content without prior written permission.</p>

        <h2>5. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, VineSecret shall not be liable for any indirect, incidental, or consequential damages arising from your use of this site.</p>

        <h2>6. Governing Law</h2>
        <p>These terms are governed by the laws of the State of California.</p>

        <h2>7. Changes</h2>
        <p>We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of any changes.</p>

        <h2>8. Contact</h2>
        <p>Questions about these terms? Email us at <a href="mailto:office@vinesecret.com">office@vinesecret.com</a>.</p>
    </>
);

const PRIVACY = (
    <>
        <h1>Privacy Policy</h1>
        <p className="legal-effective">Effective: January 1, 2025</p>

        <h2>1. Demonstration Site</h2>
        <p>VineSecret is a demonstration website. We do not sell products, process payments, or operate a wine club. This policy explains our limited data practices.</p>

        <h2>2. Information We Collect</h2>
        <p><strong>Analytics:</strong> We use Google Analytics to collect anonymized data about how visitors use this site (pages visited, time on site, general location by region). No personally identifiable information is collected through analytics.</p>
        <p><strong>Checkout form data:</strong> Any name, email, or address you enter during the demo checkout is stored only in your browser&rsquo;s local storage. It is never transmitted to or retained by any external database.</p>
        <p><strong>Order confirmation emails:</strong> If you complete the demo checkout, a confirmation email is sent via Resend to the address you provide. That email address is used solely to deliver the confirmation and is not stored, sold, or used for marketing.</p>

        <h2>3. Cookies</h2>
        <p>We use a session cookie to remember your age verification for the duration of your browser session. Google Analytics may set its own cookies for analytics purposes.</p>

        <h2>4. Do Not Sell My Information</h2>
        <p>We do not sell, rent, or trade your personal information to any third party. Because this is a demonstration site, no personal data is collected or retained beyond what is described above.</p>

        <h2>5. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
            <li><strong>Google Analytics</strong> — anonymized site usage analytics</li>
            <li><strong>Resend</strong> — transactional email delivery for order confirmations</li>
        </ul>

        <h2>6. Data Retention</h2>
        <p>No personal data is retained on our servers. Browser local storage data persists until you clear your browser data. Google Analytics data is retained per Google&rsquo;s standard retention policy.</p>

        <h2>7. Your Rights</h2>
        <p>You have the right to request access to, correction of, or deletion of any personal data we hold. Because we retain no personal data server-side, there is nothing to access or delete beyond what is in your own browser.</p>

        <h2>8. Children</h2>
        <p>This site is not directed at anyone under the age of 21. We do not knowingly collect information from minors.</p>

        <h2>9. Changes</h2>
        <p>We may update this policy from time to time. We will post the revised policy on this page with an updated effective date.</p>

        <h2>10. Contact</h2>
        <p>Questions about this policy? Email us at <a href="mailto:office@vinesecret.com">office@vinesecret.com</a>.</p>
    </>
);

const PAGES = {
    terms: { title: 'Terms of Use', content: TERMS },
    privacy: { title: 'Privacy Policy', content: PRIVACY },
};

const Legal = () => {
    const { page } = useParams();
    const current = PAGES[page];

    if (!current) {
        return (
            <section className="legal">
                <div className="legal-inner">
                    <p>Page not found. <Link to="/">Go home</Link>.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="legal">
            <div className="legal-inner">
                <nav className="legal-nav">
                    <Link to="/legal/terms" className={page === 'terms' ? 'is-active' : ''}>Terms of Use</Link>
                    <Link to="/legal/privacy" className={page === 'privacy' ? 'is-active' : ''}>Privacy Policy</Link>
                </nav>
                <div className="legal-body">
                    {current.content}
                </div>
            </div>
        </section>
    );
};

export default Legal;
