import React, { useState } from 'react';
import './contact.css';
import { trackContactMessage } from '../../analytics/tracking';

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
};

const EMAIL_RE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

function validate({ name, email, phone, subject, message }) {
    const errors = {};
    if (!name) errors.name = '*Please enter your name';
    else if (name.length < 2) errors.name = '*Name must be at least 2 characters long';

    if (!email) errors.email = '*Please enter your email';
    else if (!EMAIL_RE.test(email)) errors.email = '*Please enter a valid email address. Example: me@example.com';

    if (!phone) errors.phone = '*Please choose a phone number';
    else if (phone.length < 10) errors.phone = '*Please enter a valid phone number';

    if (!subject) errors.subject = '*Please enter a subject';
    else if (subject.length < 2) errors.subject = '*Please enter a subject longer that two letters';

    if (!message) errors.message = '*Please enter a message';
    else if (message.length > 1000) errors.message = '*Message is too long';

    return errors;
}

const Form = () => {
    const [values, setValues] = useState(EMPTY_FORM);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const next = { ...values, [name]: value };
        setValues(next);
        if (touched[name]) setErrors(validate(next));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((t) => ({ ...t, [name]: true }));
        setErrors(validate(values));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allTouched = Object.keys(EMPTY_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {});
        setTouched(allTouched);
        const nextErrors = validate(values);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length === 0) {
            trackContactMessage(values);
        }
    };

    const handleReset = () => {
        setValues(EMPTY_FORM);
        setTouched({});
        setErrors({});
    };

    const fieldError = (name) => (touched[name] && errors[name]) || null;

    return (
        <div className="contact-form-card">
            <div className="form-header">
                <p className="eyebrow">Reach out</p>
                <h2>Contact the cellar team</h2>
                <p className="lede">
                    Share your tasting plans, event ideas, or shipping questions. We respond within one business day.
                </p>
            </div>
            <form onSubmit={handleSubmit} onReset={handleReset} className="contact-form" noValidate>
                <div className="form-grid">
                    <div className="input-field">
                        <label htmlFor="name">Name</label>
                        <div className="field-group">
                            <input
                                id="name"
                                name="name"
                                className="control"
                                placeholder="Your name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {fieldError('name') && <div className="dangererror">{fieldError('name')}</div>}
                        </div>
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <div className="field-group">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="control"
                                placeholder="you@example.com"
                                autoComplete="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {fieldError('email') && <div className="dangererror">{fieldError('email')}</div>}
                        </div>
                    </div>
                    <div className="input-field">
                        <label htmlFor="phone">Phone</label>
                        <div className="field-group">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className="control"
                                placeholder="(707) 555-1234"
                                autoComplete="tel"
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {fieldError('phone') && <div className="dangererror">{fieldError('phone')}</div>}
                        </div>
                    </div>
                    <div className="input-field">
                        <label htmlFor="subject">Subject</label>
                        <div className="field-group">
                            <input
                                id="subject"
                                name="subject"
                                className="control"
                                placeholder="Reservation or question"
                                autoComplete="on"
                                value={values.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {fieldError('subject') && <div className="dangererror">{fieldError('subject')}</div>}
                        </div>
                    </div>
                </div>
                <div className="input-field">
                    <label htmlFor="message">Message</label>
                    <div className="field-group">
                        <textarea
                            id="message"
                            name="message"
                            className="control"
                            placeholder="How can we help?"
                            rows={4}
                            value={values.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        {fieldError('message') && <div className="dangererror">{fieldError('message')}</div>}
                    </div>
                </div>
                <div className="form-actions">
                    <button className="btn primary" type="submit">
                        Send message
                    </button>
                    <button className="btn brass" type="reset">
                        Reset form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;
