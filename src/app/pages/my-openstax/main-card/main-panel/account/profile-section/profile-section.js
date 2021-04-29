import React from 'react';
import { useStoreon } from 'storeon/preact';
import EditInstitutionsDialogLink from './edit-institutions/edit-institutions.js';
import './profile-section.scss';

export default function ProfileSection() {
    const { user } = useStoreon('user');

    return (
        <section className="profile-section">
            <h2>Profile</h2>
            <EditInstitutionsDialogLink text="Edit institutions" />
            <table>
                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Current institutions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{user.role}</td>
                        <td>{(user.institutions[0] || {}).name}</td>
                    </tr>
                    {
                        user.institutions.slice(1).map((i) =>
                            <tr key={i.id}>
                                <td />
                                <td>{i.name}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </section>
    );
}
