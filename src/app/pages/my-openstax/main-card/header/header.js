import React from 'react';
import './header.scss';
import useAccount from '~/pages/my-openstax/store/use-account';

export default function Header() {
    const {firstName='', lastName=''} = useAccount();
    const initials = `${firstName.substr(0, 1)}${lastName.substr(0, 1)}`;

    return (
        <div className='header'>
            <div className='initials'>{initials}</div>
            <h1>My OpenStax</h1>
        </div>
    );
}
