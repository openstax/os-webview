import React from 'react';
import './header.scss';
import { useStoreon } from 'storeon/preact';

export default function Header() {
    const { account } = useStoreon('account');
    const initials = 'firstName' in account ?
        `${account.firstName.substr(0, 1)}${account.lastName.substr(0, 1)}` :
        '';

    return (
        <div className='header'>
            <div className='initials'>{initials}</div>
            <h1>Settings</h1>
        </div>
    );
}
