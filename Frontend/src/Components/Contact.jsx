import React from 'react';
import Navbar from './Navbar';

const ContactUs = () => {
    return (
        <>
        <Navbar/>
        <div className="contact-page-container">
            <h1 className="contact-heading">Get in Touch</h1>
            <p className="contact-subheading">
                We'd love to hear from you! Reach out to us via the options below.
            </p>

            <div className="contact-options">
                {/* WhatsApp */}
                <div className="contact-item">
                    <i className="fa fa-whatsapp contact-icon"></i>
                    <a
                        href="https://wa.me/1234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        WhatsApp
                    </a>
                </div>

                {/* Instagram */}
                <div className="contact-item">
                    <i className="fa fa-instagram contact-icon"></i>
                    <a
                        href="https://instagram.com/kchbhi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        Instagram
                    </a>
                </div>

                {/* Facebook */}
                <div className="contact-item">
                    <i className="fa fa-facebook contact-icon"></i>
                    <a
                        href="https://facebook.com/kchbhi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        Facebook
                    </a>
                </div>

                {/* LinkedIn */}
                <div className="contact-item">
                    <i className="fa fa-linkedin contact-icon"></i>
                    <a
                        href="https://linkedin.com/company/kchbhi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                    >
                        LinkedIn
                    </a>
                </div>

                {/* Email */}
                <div className="contact-item">
                    <i className="fa fa-envelope contact-icon"></i>
                    <a
                        href="mailto:support@kchbhi.com"
                        className="contact-link"
                    >
                        Email
                    </a>
                </div>

                {/* Call */}
                <div className="contact-item">
                    <i className="fa fa-phone contact-icon"></i>
                    <a href="tel:+1234567890" className="contact-link">
                        Call Us
                    </a>
                </div>
            </div>
        </div>
        </>
    );
};

export default ContactUs;
