import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import PartnerDetails from '~/pages/partners/partner-details/partner-details';
import partnerEntryData from '~/../../test/src/data/salesforce-partners';
import {resultEntry} from '~/pages/partners/results/results';

// react-aria-carousel does not play nice with Jest
jest.mock('react-aria-carousel', () => ({
    Carousel: jest
        .fn()
        .mockImplementation(({children}) => (
            <div className="Carousel">{children}</div>
        ))
}));
Element.prototype.scrollTo = jest.fn();

describe('partner-details', () => {
    const partnerData = resultEntry(partnerEntryData[1]);
    const linkTexts = {
        websiteLinkText: 'website text',
        infoLinkText: 'info text'
    };

    console.warn = jest.fn();

    it('shows no synopsis if there is no partnerName', () => {
        const data = {...partnerData, ...linkTexts, title: ''}; // title is partnerName
        const setTitle = jest.fn();

        render(
            <PartnerDetails detailData={data} title="" setTitle={setTitle} />
        );
        expect(document.body.querySelector('.synopsis')).toBeNull();
    });
    it('displays synopsis', () => {
        const data = {...partnerData, ...linkTexts};
        const setTitle = jest.fn();

        render(
            <PartnerDetails detailData={data} title="" setTitle={setTitle} />
        );
        screen.findByText(partnerData.title);
        screen.findByText(data.tags[0].value as string);
    });
    it('displays images/videos if present', async () => {
        const data = {
            ...partnerData,
            ...linkTexts,
            videos: ['/path/to/video'],
            images: ['/path/to/image']
        };
        const setTitle = jest.fn();

        render(
            <PartnerDetails detailData={data} title="" setTitle={setTitle} />
        );
        await waitFor(() =>
            expect(document.querySelector('.Carousel')).toBeTruthy()
        );
    });
});
