import React from 'react';
import Schedule from '../general/schedule';
import './contact.css';
import ContactForm from './contact_form';
import grapes from '../../assets/images/grapes.jpg';
import { trackEmailClick, trackEngagement } from '../../analytics/tracking';

const Contact = () => (
    <section className="contact">
        <div className="contact-inner">
            <header className="contact-hero">
                <div>
                    <p className="eyebrow">Visit & connect</p>
                    <h2>Schedule a tasting or drop us a note.</h2>
                    <p className="lede">
                        Talk wine with the people who make it. Whether you're planning a club pickup, a private tasting, or have
                        a question about a bottle in your cellar, we would love to hear from you.
                    </p>
                    <div className="contact-details">
                        <div>
                            <span className="label">Email</span>
                            <a
                                href="mailto:office@vinesecret.com"
                                onClick={() => trackEmailClick('contact_header_email', 'office@vinesecret.com')}
                            >
                                office@vinesecret.com
                            </a>
                        </div>
                        <div>
                            <span className="label">Phone orders</span>
                            <Schedule />
                        </div>
                        <div>
                            <span className="label">Tasting room</span>
                            <p>by appointment • Sonoma & the Bay</p>
                        </div>
                    </div>
                </div>
                <div className="contact-hero__image">
                    <img src={grapes} className="img-grapes" alt="Grapes ready for harvest" />
                    <div className="image-caption">Hand-harvested rows picked at first light.</div>
                </div>
            </header>

            <div className="contact-grid">
                <ContactForm />
                <div className="visit-card">
                    <p className="eyebrow">Visit</p>
                    <h3>Plan your tasting</h3>
                    <p>
                        We host intimate flights for club members, collectors, and curious guests. Tell us your preferred dates
                        and we’ll tailor a lineup from the cellar.
                    </p>
                    <ul>
                        <li>Seated tastings with seasonal pairings.</li>
                        <li>Private events for up to 12 guests.</li>
                        <li>Concierge shipping for on-site selections.</li>
                    </ul>
                    <div className="card-actions">
                        <a
                            className="btn ghost"
                            href="tel:+17075551234"
                            onClick={() => trackEngagement('call_cellar', 'contact')}
                        >
                            Call the cellar
                        </a>
                        <a
                            className="btn primary"
                            href="mailto:office@vinesecret.com?subject=Tasting%20Request"
                            onClick={() => trackEmailClick('contact_visit_email', 'office@vinesecret.com')}
                        >
                            Email a date
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Contact;
