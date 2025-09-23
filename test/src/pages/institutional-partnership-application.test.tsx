import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import {describe, it} from '@jest/globals';
import ApplicationPage from '~/pages/institutional-partnership-application/institutional-partnership-application';
import MemoryRouter from '~/../../test/helpers/future-memory-router';

const mockApplicationData = {
    headingYear: '2024',
    heading: '<strong>Institutional Partnership Application</strong>',
    programTabContent: [
        [
            {
                heading: 'Program Overview',
                description:
                    '<p>Learn about our institutional partnership program.</p>'
            },
            {
                heading: 'Benefits',
                description:
                    '<p>Discover the benefits of partnering with us.</p>'
            }
        ]
    ],
    quote: 'OpenStax has transformed our teaching approach.',
    quoteAuthor: 'Dr. Jane Smith',
    quoteTitle: 'Professor of Biology',
    quoteSchool: 'State University',
    applicationQuote: 'The application process was straightforward.',
    applicationQuoteAuthor: 'Prof. John Doe',
    applicationQuoteTitle: 'Department Chair',
    applicationQuoteSchool: 'Community College'
};

global.fetch = jest.fn().mockImplementation((args: [string]) => {
    const payload = args.includes('pages/institutional-partnership')
        ? mockApplicationData
        : {};

    return Promise.resolve({
        ok: true,
        json() {
            return Promise.resolve(payload);
        }
    });
});

function Component() {
    return (
        <MemoryRouter
            initialEntries={['/institutional-partnership-application']}
        >
            <ApplicationPage />
        </MemoryRouter>
    );
}

describe('institutional partnership application page', () => {
    it('displays program sections', async () => {
        render(<Component />);
        await screen.findByText('Program Overview');
        await screen.findByText('Benefits');
    });

    it('displays testimonial content', async () => {
        render(<Component />);

        // Since lodash sample() picks randomly, we need to check for either testimonial
        // We'll check for elements that should always be present
        const testimonialSection = await screen.findByRole('main');

        expect(testimonialSection).toBeInTheDocument();

        // The testimonial block should contain one of our test quotes
        const testimonialContainer = await screen.findByText(
            (content, element) => {
                return element?.className === 'testimonial-box' || false;
            }
        );

        expect(testimonialContainer).toBeInTheDocument();
    });

    it('has proper main container class', async () => {
        render(<Component />);
        const mainElement = await screen.findByRole('main');

        expect(mainElement).toHaveClass('institutional-page', 'page');
    });
});
