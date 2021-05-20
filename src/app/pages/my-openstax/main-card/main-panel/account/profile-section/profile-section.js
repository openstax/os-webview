import React from 'react';
import useInstitutions from '~/pages/my-openstax/store/use-institutions';
import useAccount from '~/pages/my-openstax/store/use-account';
import EditInstitutionsDialogLink from './edit-institutions/edit-institutions.js';
import './profile-section.scss';

export default function ProfileSection() {
    const account = useAccount();
    const {institutions} = useInstitutions();
    const verification = account.facultyVerified ? 'Verified' : 'Unverified';

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
                        <td>
                            {account.role}{' '}
                            <span className="role-status">({verification})</span>
                        </td>
                        <td>{(institutions[0] || {}).name}</td>
                    </tr>
                    {
                        institutions.slice(1).map((i) =>
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
