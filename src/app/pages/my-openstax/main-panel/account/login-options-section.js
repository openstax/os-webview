import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons/faFacebookF';
import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons/faEnvelope';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { DotSeparatedElements } from '../common';

function LoginOptionLabel({ icon, label}) {
    const iconLookup = {
        'facebook-f': faFacebookF,
        'google': faGoogle,
        'envelope': faEnvelope
    };

    return (
        <td className='login-option-label'>
            <div className={`icon ${icon}`}>
                <FontAwesomeIcon icon={iconLookup[icon] || faExclamationTriangle} />
            </div>
            <div>{label}</div>
        </td>
    );
}

export default function LoginOptionsSection() {
    return (
        <section>
            <h3>Login options</h3>
            <table className='login-table'>
                <tr>
                    <LoginOptionLabel icon='facebook-f' label='Facebook' />
                    <td>
                        <DotSeparatedElements>
                            Connect
                        </DotSeparatedElements>
                    </td>
                </tr>
                <tr>
                    <LoginOptionLabel icon='google' label='Google' />
                    <td>
                        <DotSeparatedElements>
                            <span>spike@gmail.com</span>
                            <a href='/disconnect'>Disconnect</a>
                        </DotSeparatedElements>
                    </td>
                </tr>
                <tr>
                    <LoginOptionLabel icon='envelope' label='Email' />
                    <td>
                        <DotSeparatedElements>
                            <span>spike@gmail.com</span>
                            <b>Primary</b>
                            <a href='/disconnect'>Disconnect</a>
                        </DotSeparatedElements>
                        <DotSeparatedElements>
                            <span>spike@bebop.co</span>
                            <a href='/make-primary'>Make primary</a>
                            <a href='/disconnect'>Disconnect</a>
                        </DotSeparatedElements>
                        <DotSeparatedElements>
                            <span>spike@bebop.co</span>
                            <span>(Unconfirmed)</span>
                            <a href='/make-primary'>Resend confirmation</a>
                            <a href='/disconnect'>Delete</a>
                        </DotSeparatedElements>
                        <DotSeparatedElements>
                            <a href='/add-email'>Add an email</a>
                        </DotSeparatedElements>

                    </td>
                </tr>
            </table>
        </section>
    );
}
