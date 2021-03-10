import React from 'react';
import './logo.css';

export default function Logo() {
    return (
        <span className="logo-wrapper">
            <span className="logo">
                <a href="/" aria-label="Home Page">
                    <img className="logo-color" src="/images/logo.svg" alt="OpenStax logo" />
                    <img className="logo-white" src="/images/logo-white.svg" alt="OpenStax logo" />
                </a>
            </span>

            <span className="logo-quote">Access. The future of education.</span>
        </span>
    );
}
