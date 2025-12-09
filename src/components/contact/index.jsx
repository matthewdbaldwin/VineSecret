import React from 'react';
import Schedule from '../general/schedule/index.js';
import './contact.css';
import ContactForm from './contact_form.js';
import grapes from '../../assets/images/grapes.jpg'


const Contact = () => (
    <section className="contact">
        <div className="contact-grid">
            <div className="contact-copy">
                <p className="eyebrow">Visit & connect</p>
                <h2>Schedule a tasting or drop us a note.</h2>
                <p>
                    Talk wine with the people who make it. Whether you're planning a club pickup, a private tasting, or have a
                    question about a bottle in your cellar, we would love to hear from you.
                </p>
                <div className="contact-details">
                    <div>
                        <span className="label">Email</span>
                        <a href="mailto:office@vinesecret.com">office@vinesecret.com</a>
                    </div>
                    <div>
                        <span className="label">Phone orders</span>
                        <Schedule />
                    </div>
                </div>
                <img src={grapes} className="img-grapes" alt="Grapes ready for harvest" />
            </div>
            <div className="formdiv">
                <ContactForm />
            </div>
        </div>
    </section>
);

export default Contact;
