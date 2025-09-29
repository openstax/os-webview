import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import FoundationPage from '~/pages/foundation/foundation';
import MemoryRouter from '~/../../test/helpers/future-memory-router';

const mockFoundationData = {
    bannerImage: {
        meta: {
            downloadUrl: 'https://example.com/banner.jpg'
        }
    },
    bannerHeading: 'Our Supporters',
    bannerDescription:
        '<p>Thanks to generous funders who support our mission.</p>',
    funderGroups: [
        {
            groupTitle: 'Major Funders',
            description: 'Organizations that provide significant support',
            funders: [
                {
                    funderName: 'Test Foundation',
                    url: 'https://example.com'
                },
                {
                    funderName: 'Another Supporter'
                }
            ]
        },
        {
            groupTitle: 'Secondary Funders',
            description: 'Organizations that provide support',
            image: {file: '/path/to/image'},
            funders: []
        }
    ],
    disclaimer: 'All funders listed have provided support to OpenStax.'
};

global.fetch = jest.fn().mockImplementation((args: [string]) => {
    const payload = args.includes('pages/supporters') ? mockFoundationData : {};

    return Promise.resolve({
        ok: true,
        json() {
            return Promise.resolve(payload);
        }
    });
});

describe('foundation page', () => {
    it('displays funder groups', async () => {
        render(
            <MemoryRouter initialEntries={['/foundation']}>
                <FoundationPage />
            </MemoryRouter>
        );
        await screen.findByText('Our Supporters');
        await screen.findByText('Major Funders');
        await screen.findByText(
            'Organizations that provide significant support'
        );
    });

    it('displays funders with and without links', async () => {
        render(
            <MemoryRouter initialEntries={['/foundation']}>
                <FoundationPage />
            </MemoryRouter>
        );
        const linkedFunder = await screen.findByRole('link', {
            name: 'Test Foundation'
        });

        expect(linkedFunder.getAttribute('href')).toBe('https://example.com');

        await screen.findByText('Another Supporter');
    });

    it('displays disclaimer', async () => {
        render(
            <MemoryRouter initialEntries={['/foundation']}>
                <FoundationPage />
            </MemoryRouter>
        );
        await screen.findByText(
            'All funders listed have provided support to OpenStax.'
        );
    });
});
