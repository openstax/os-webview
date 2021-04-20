import React from 'react';
import { useStoreon } from 'storeon/preact';
import { LoadingSection } from '../common';
import LabeledData from '~/pages/my-openstax/labeled-data/labeled-data';
import orderBy from 'lodash/orderBy';
import cn from 'classnames';
import './account.scss';

const accountsHost = 'https://accounts-dev.openstax.org';

function Email({ email }) {
    return (
        <div className={cn('email', { unconfirmed: !email.verified, primary: email.primary })}>
            {email.address}
        </div>
    );
}

function Account({ store }) {
    const emails = orderBy(store.emails, ['primary', 'verified'], ['desc', 'desc']);

    return (
        <LabeledData Tag='section' LabelTag='h2' label='Account' id='account'>
            <a className='edit-link' href={accountsHost}>Edit account details</a>
            <LabeledData Tag='section' LabelTag='h3' label='General'>
                <div className='fields general-fields'>
                    <LabeledData label='First name' children={store.firstName} />
                    <LabeledData label='Last name' children={store.lastName} />
                </div>
            </LabeledData>
            <LabeledData Tag='section' LabelTag='h3' label='Password'>
                ••••••••••••
            </LabeledData>
            <LabeledData Tag='section' LabelTag='h3' label='Email addresses' className='emails'>
                {emails.map((email) => <Email email={email} key={email.address} />)}
            </LabeledData>
        </LabeledData>
    );
}

export default function AccountLoader() {
    const { account: store } = useStoreon('account');

    return (
        store.ready ? <Account store={store} /> : <LoadingSection />
    );
}
