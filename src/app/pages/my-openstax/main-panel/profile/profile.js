import React from 'react';
import './profile.scss';
import InstitutionSection from './institutions';
import RoleSection from './role';

export default function Profile() {
    return (
        <section id='profile'>
            <h2>Profile</h2>
            <RoleSection />
            <InstitutionSection />
        </section>
    );
}
