import React from 'react';
import './logo.scss';

export default function Logo() {
    return (
        <span className="logo-wrapper">
            <span className="logo">
                <a href="/" aria-label="Home Page" data-analytics-link>
                    <img
                        className="logo-color" src="/dist/images/logo.svg" alt="OpenStax logo"
                        width="354" height="81"
                    />
                    <img className="logo-white" src="/dist/images/logo-white.svg" alt="OpenStax logo" />
                </a>
            </span>

            <span className="logo-quote">Access. The future of education.</span>
        </span>
    );
}
