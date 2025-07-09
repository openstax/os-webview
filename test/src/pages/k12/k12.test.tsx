import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {LanguageContextProvider} from '~/contexts/language';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import K12Router from '~/pages/k12/k12';

jest.mock('~/pages/k12/subject/subject', () =>
    jest.fn().mockReturnValue(<>Specific subject</>)
);

describe('k12 page', () => {
    const user = userEvent.setup();

    jest.setTimeout(8000);
    it('routes to main k12 page with no path', async () => {
        render(
            <LanguageContextProvider>
                <MemoryRouter initialEntries={['']}>
                    <K12Router />
                </MemoryRouter>
            </LanguageContextProvider>
        );
        // Test the subject grid filters
        await screen.findByRole('link', {name: 'Algebra'});
        await user.click(screen.getByRole('radio', {name: 'Science'}));
        expect(screen.queryByRole('link', {name: 'Algebra'})).toBeNull();
        // Test the testimonial carousel
        const carouselButton2 = await screen.findByRole('radio', {name: 'carousel button 2'});

        await user.click(carouselButton2);
        expect(carouselButton2.getAttribute('aria-selected')).toBe('true');
        // Test the banner navigator -- must be last, it empties the page
        const [bannerSelect] = screen.getAllByRole('combobox');
        const saveWarn = console.warn;

        console.warn = jest.fn();

        await user.selectOptions(bannerSelect, 'Algebra');
        expect(console.warn).toHaveBeenCalledWith('No routes matched location "/k12/algebra" ');
        console.warn = saveWarn;
    });
    it('routes to specific subject with path', async () => {
        render(
            <MemoryRouter initialEntries={['/math']}>
                <K12Router />
            </MemoryRouter>
        );
        await screen.findAllByText('Specific subject');
    });
});
