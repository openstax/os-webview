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
            <div className="table-ish">
                <div className="head col-1">Role</div>
                <div className="head col-2">Current institutions</div>
                <div className="body col-1">
                    {account.role}{' '}
                    <span className="role-status">({verification})</span>
                </div>
                <div className="body col-2">
                    {institutions.map((i) => <div key={i.id}>{i.name}</div>)}
                </div>
            </div>
        </section>
    );
}
