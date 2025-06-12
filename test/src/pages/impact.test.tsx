import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/preact';
import ImpactLoader from '~/pages/impact/impact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as DH from '~/helpers/use-document-head';
import * as D from '~/components/dialog/dialog';
import articleData from '../data/testimonial-article';

jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();
jest.spyOn(D, 'default').mockImplementation(({children}) => <div role="dialog">{children}</div>);

// react-aria-carousel does not play nice with Jest
jest.mock('react-aria-carousel', () => ({
    Carousel: jest.fn().mockImplementation(({children}) =>
        <div role="region" aria-label="fake-carousel">{children}</div>)
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    __esModule: true,
    useNavigate: jest.fn()
}));

describe('impact page', () => {
    const mainMockFetch = global.fetch;

    global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url.match(/pages\/\d\d\d/)) {
            const meta = (url.includes('768')) ?
                undefined :
                {html_url: 'file-path'}; // eslint-disable-line camelcase

            return Promise.resolve({
                json: () => ({
                    ...articleData,
                    meta
                })
            });
        }
        return mainMockFetch(url);
    });
    it('Renders', async () => {
        render(
            <MemoryRouter initialEntries={['/impact']}>
                <ImpactLoader />
            </MemoryRouter>
        );

        expect(((await screen.findByRole('heading', {level: 1}))).textContent).toBe('Our Mission');
        const carousel = await screen.findByRole('region', {name: 'fake-carousel'});

        await(waitFor(() => expect(carousel.querySelectorAll('.card a').length).toBeGreaterThan(150)));
        const links = Array.from(carousel.querySelectorAll<HTMLAnchorElement>('.card a')).filter((el) =>
            el.textContent === 'Read more '
        );

        // user.click breaks. This works.
        fireEvent.click(links[0]);
    });
});
