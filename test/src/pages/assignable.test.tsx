import React from 'react';
import {render, screen} from '@testing-library/preact';
import AssignableLoader from '~/pages/assignable/assignable';
import * as LI from '~/pages/assignable/lazy-imports';
import Banner from '~/pages/assignable/sections/banner/banner';
import About from '~/pages/assignable/sections/about/about';
import Courses from '~/pages/assignable/sections/courses/courses';
import FAQ from '~/pages/assignable/sections/faq/faq';
import OverlappingQuote from '~/pages/assignable/sections/overlapping-quote/overlapping-quote';
import CTA from '~/pages/assignable/sections/cta/cta';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as DH from '~/helpers/use-document-head';
import '@testing-library/jest-dom';

jest.spyOn(LI, 'Banner').mockImplementation(
    (args: Parameters<typeof Banner>[0]) => <Banner {...args} />
);
jest.spyOn(LI, 'About').mockImplementation(
    (args: Parameters<typeof About>[0]) => <About {...args} />
);
jest.spyOn(LI, 'Courses').mockImplementation(
    (args: Parameters<typeof Courses>[0]) => <Courses {...args} />
);
jest.spyOn(LI, 'FAQ').mockImplementation((args: Parameters<typeof FAQ>[0]) => (
    <FAQ {...args} />
));
jest.spyOn(LI, 'OverlappingQuote').mockImplementation(
    (args: Parameters<typeof OverlappingQuote>[0]) => (
        <OverlappingQuote {...args} />
    )
);
jest.spyOn(LI, 'CTA').mockImplementation((args: Parameters<typeof CTA>[0]) => (
    <CTA {...args} />
));
jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

// react-aria-carousel does not play nice with Jest
jest.mock('react-aria-carousel', () => ({
    Carousel: jest.fn()
}));

describe('AssignableLoader', () => {
    test('renders main assignable page structure', () => {
        render(<AssignableLoader />);

        // Check that main element has correct classes
        const mainElement = document.querySelector('main.assignable.page');

        expect(mainElement).toBeInTheDocument();
    });

    test('loads with correct slug', async () => {
        render(
            <MemoryRouter initialEntries={['/assignable']}>
                <AssignableLoader />
            </MemoryRouter>
        );

        const sections = await screen.findAllByRole('generic');

        expect(sections.length).toBe(2);
        await screen.findByRole('heading', {
            level: 2,
            name: 'Take your teaching to the next level'
        });
    });
});
