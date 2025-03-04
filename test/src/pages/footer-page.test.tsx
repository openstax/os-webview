import React from 'react';
import {render, screen} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import * as UPD from '~/helpers/use-page-data';
import FooterPage from '~/pages/footer-page/footer-page';

const mockUsePageData = jest.spyOn(UPD, 'default');

// @ts-expect-error does not exist on
const {routerFuture} = global;

window.scrollTo = jest.fn();

describe('footer-page', () => {
    const saveWarn = console.warn;

    it('renders', () => {
        mockUsePageData.mockReturnValue({
            introHeading: 'heading',
            title: 'docTitle',
            meta: {
                searchDescription: 'description in head'
            },
            pageContent: 'the html for the page'
        });
        console.warn = jest.fn();

        render(
            <MemoryRouter initialEntries={['/aslug']} future={routerFuture}>
                <FooterPage />
            </MemoryRouter>);
        expect((screen.getByRole('heading', {level: 1})).textContent).toBe('heading');
        expect(document.head.querySelector('title')?.textContent).toBe('docTitle - OpenStax');
        console.warn = saveWarn;
    });
    it('renders nothing until page data is received', async () => {
        mockUsePageData.mockReturnValue(null);
        render(
            <MemoryRouter initialEntries={['/aslug']} future={routerFuture}>
                <FooterPage />
            </MemoryRouter>);
        expect(document.body.textContent).toBe('');
    });
});
