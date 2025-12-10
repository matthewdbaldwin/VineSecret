import React from 'react';
import './contact.css';
import { Field, reduxForm } from 'redux-form';
import CustomInput from './CustomInput';

const Form = (props) => {
    const handleFormSubmit = (formValues) => {
        // Form submission hook for future integrations
        // console.log('On Submit Simple Form Values:', formValues);
    };

    const { handleSubmit } = props;

    return (
        <div className="contact-form-card">
            <div className="form-header">
                <p className="eyebrow">Reach out</p>
                <h2>Contact the cellar team</h2>
                <p className="lede">
                    Share your tasting plans, event ideas, or shipping questions. We respond within one business day.
                </p>
            </div>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="contact-form">
                <div className="form-grid">
                    <div className="input-field">
                        <label htmlFor="name">Name</label>
                        <Field
                            id="name"
                            name="name"
                            className="control"
                            placeholder="Your name"
                            component={CustomInput}
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <Field
                            id="email"
                            name="email"
                            className="control"
                            placeholder="you@example.com"
                            component={CustomInput}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="phone">Phone</label>
                        <Field
                            id="phone"
                            name="phone"
                            className="control"
                            placeholder="(707) 555-1234"
                            component={CustomInput}
                            type="tel"
                            autoComplete="tel"
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="subject">Subject</label>
                        <Field
                            id="subject"
                            name="subject"
                            className="control"
                            placeholder="Reservation or question"
                            component={CustomInput}
                            autoComplete="on"
                            required
                        />
                    </div>
                </div>
                <div className="input-field">
                    <label htmlFor="message">Message</label>
                    <Field
                        id="message"
                        name="message"
                        className="control"
                        placeholder="How can we help?"
                        component={CustomInput}
                        type="textarea"
                        autoComplete="on"
                    />
                </div>
                <div className="form-actions">
                    <button className="btn primary" type="submit">
                        Send message
                    </button>
                    <button className="btn ghost" type="reset">
                        Reset form
                    </button>
                </div>
            </form>
        </div>
    );
};

function validate(formValues) {
    const { name, email, phone, subject, message } = formValues;
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    const errors = {};

    if (!name) {
        errors.name = '*Please enter your name';
    } else if (name.length < 2) {
        errors.name = '*Name must be at least 2 characters long';
    }

    if (!email) {
        errors.email = '*Please enter your email';
    } else if (!emailRegEx.test(email)) {
        errors.email = '*Please enter a valid email address. Example: me@example.com';
    }

    if (!phone) {
        errors.phone = '*Please choose a phone number';
    } else if (phone.length < 10) {
        errors.phone = '*Please enter a valid phone number';
    }

    if (!subject) {
        errors.subject = '*Please enter a subject';
    } else if (subject.length < 2) {
        errors.subject = '*Please enter a subject longer that two letters';
    }

    if (!message) {
        errors.message = '*Please enter a message';
    } else if (message.length > 1000) {
        errors.message = '*Message is too long';
    }

    return errors;
}

export default reduxForm({ form: 'Form', validate })(Form);
