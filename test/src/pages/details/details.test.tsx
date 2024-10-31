import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import BookDetailsLoader from '~/pages/details/details';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import * as DH from '~/helpers/use-document-head';
import $ from '~/helpers/$';
import * as WC from '~/contexts/window';

// Tamp down meaningless errors
jest.mock('~/models/rex-release', () => jest.fn().mockReturnValue(Promise.resolve({
    webviewRexLink: '',
    contents: []
})));
jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));
jest.mock('~/models/table-of-contents-html', () => jest.fn().mockReturnValue(Promise.resolve({})));

jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();
const spyIsPolish = jest.spyOn($, 'isPolish');
const spyWindowContext = jest.spyOn(WC, 'default');

function Component() {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={['/details/books/college-algebra']}>
                <Routes>
                    <Route path="/details/books/:title" element={<BookDetailsLoader />} />
                </Routes>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

async function finishedRendering() {
    const main = await screen.findByRole('main');

    return await waitFor(() => expect(main.getAttribute('class')).toBe('details-page light-blue'));
}

function lengthOfView(phoneOrBigger: string) {
    const main = screen.getByRole('main');
    const view = main.querySelector(`.${phoneOrBigger}-view`);

    return view?.textContent?.length;
}

describe('Details page', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
        const el = document.createElement('meta');

        el.setAttribute('name', 'description');
        document.head.appendChild(el);
    });

    it('renders book', async () => {
        spyWindowContext.mockReturnValue({innerWidth: 1280} as any); // eslint-disable-line
        render(<Component />);
        await finishedRendering();
        expect(lengthOfView('phone')).toBeUndefined();
        expect(lengthOfView('bigger')).toBe(98);

        const jsonLdScript = document.head.querySelector('script');

        expect(jsonLdScript?.textContent).toEqual(expect.stringContaining('mainEntity'));
    });
    it('renders Polish book', async () => {
        spyIsPolish.mockReturnValue(true);
        render(<Component />);
        await finishedRendering();
        spyIsPolish.mockReset();
        const jsonLdScript = document.head.querySelector('script');

        expect(jsonLdScript?.textContent).toEqual(expect.stringContaining('Polish'));
    });
    it('renders only phone-view at phone width', async () => {
        spyWindowContext.mockReturnValue({innerWidth: 480} as any); // eslint-disable-line
        render(<Component />);
        await finishedRendering();
        expect(lengthOfView('phone')).toBe(346);
        expect(lengthOfView('bigger')).toBeUndefined();
    });
    it('handles missing description', async () => {
        document.head.removeChild(document.head.querySelector('meta[name="description"]') as Node);
        render(<Component />);
        await finishedRendering();
        expect(document.head.querySelector('script')).toBeNull();
    });
});
