import React from 'react';
import {render, screen} from '@testing-library/preact';
import usePartnerContext, {
    PartnerContextProvider
} from '~/pages/partners/partner-details/partner-context';

const model = {
    title: 'Visible Body',
    blurb: '<p>... quizzes.</p>',
    tags: [
        {
            label: 'type',
            value: 'Online homework'
        },
        {
            label: 'cost',
            value: '$26-$40; >$40'
        }
    ],
    richDescription: '...quizzes.',
    logoUrl: null,
    books: ['Anatomy & Physiology', 'Biology'],
    advancedFeatures: [],
    website: 'https://www.visiblebody.com/open-stax',
    partnerWebsite: null,
    images: [],
    videos: [],
    type: 'Online homework',
    cost: '$26-$40; >$40',
    rating: 0,
    ratingCount: 0,
    partnershipLevel: 'Full partner',
    yearsAsPartner: 5,
    websiteLinkText: 'Visit partner website',
    infoLinkText: 'Request Info!'
};

function Component() {
    const [title, setTitle] = React.useState('');
    const contextValueParameters = {
        id: 1,
        model,
        title,
        setTitle
    };

    return (
        <PartnerContextProvider contextValueParameters={contextValueParameters}>
            <InContext />
        </PartnerContextProvider>
    );
}

function InContext() {
    const {toggleForm, showInfoRequestForm} = usePartnerContext();

    React.useEffect(() => {
        toggleForm?.();
        setTimeout(() => toggleForm?.(), 10);
    });

    return showInfoRequestForm ? 'showing' : 'hiding';
}

describe('partner context', () => {
    jest.useFakeTimers();
    it('toggles title', () => {
        render(<Component />);
        screen.findByText('hiding');
        jest.runAllTimers();
        screen.findByText('showing');
    });
});
