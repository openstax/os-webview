import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import BookDetailsLoader from '~/pages/details/details';
import {Routes, Route} from 'react-router-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import * as DH from '~/helpers/use-document-head';
import $ from '~/helpers/$';
import * as WC from '~/contexts/window';
import * as RBU from '~/pages/details/common/resource-box/resource-box-utils';

// Tamp down meaningless errors
jest.mock('~/models/rex-release', () =>
    jest.fn().mockReturnValue(
        Promise.resolve({
            webviewRexLink: '',
            contents: []
        })
    )
);
jest.mock('~/models/give-today', () => jest.fn().mockReturnValue({}));
jest.mock('~/models/table-of-contents-html', () =>
    jest.fn().mockReturnValue(Promise.resolve({}))
);

jest.spyOn(window, 'scrollBy').mockImplementation(() => null);
jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();
const spyIsPolish = jest.spyOn($, 'isPolish');
const spyWindowContext = jest.spyOn(WC, 'default');

function Component({path='/details/books/college-algebra'}) {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route
                        path="/details/books/:title"
                        element={<BookDetailsLoader />}
                    />
                </Routes>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

async function finishedRendering() {
    const main = await screen.findByRole('main');

    return await waitFor(() =>
        expect(main.getAttribute('class')).toBe('details-page light-blue')
    );
}

function lengthOfView(phoneOrBigger: string) {
    const main = screen.getByRole('main');
    const view = main.querySelector(`.${phoneOrBigger}-view`);

    return view?.textContent?.length;
}

describe('Details page', () => {
    const user = userEvent.setup();
    const saveWarn = console.warn;

    beforeEach(() => {
        document.head.innerHTML = '';
        const el = document.createElement('meta');

        el.setAttribute('name', 'description');
        document.head.appendChild(el);
    });
    console.debug = jest.fn();

    it('renders book with video data', async () => {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyWindowContext.mockReturnValue({innerWidth: 1280} as any);
        render(<Component />);
        await finishedRendering();
        expect(lengthOfView('phone')).toBeUndefined();
        expect(lengthOfView('bigger')).toBe(794);

        const jsonLdScript = document.head.querySelector('script');

        expect(jsonLdScript?.textContent).toEqual(
            expect.stringContaining('mainEntity')
        );
        const tabs = screen.getAllByRole('tab');

        expect(tabs).toHaveLength(4);
        // These do not seem to update the tab state as expected, though they
        // do exercise some code.
        await user.click(tabs[1]);
    });
    it('renders with Student tab selected', async () => {
        const mockLocation = jest.spyOn(window, 'location', 'get').mockReturnValue({
            ...window.location,
            search: '?Student%20resources'
        });

        render(<Component path='/details/books/biology-2e' />);
        const tabs = await screen.findAllByRole('tab');

        expect(tabs[2].getAttribute('aria-selected')).toBe('true');
        await user.click(tabs[1]);
        mockLocation.mockRestore();
    });
    it('renders with Instructor tab selected', async () => {
        jest.spyOn(RBU, 'useResources').mockReturnValue({
            bookVideoFacultyResources: [],
            bookFacultyResources: []
        });
        const mockLocation = jest.spyOn(window, 'location', 'get').mockReturnValue({
            ...window.location,
            search: '?Instructor%20resources'
        });

        render(<Component />);
        await finishedRendering();
        const tabs = screen.getAllByRole('tab');

        expect(tabs[1].getAttribute('aria-selected')).toBe('true');
        await user.click(tabs[2]);

        screen.getByRole('heading', {name: 'Technology Partners'});
        console.warn = jest.fn();
        await user.click(screen.getByRole('link', {name: 'MagicBox E-Reader'}));
        expect(console.warn).toHaveBeenCalled();
        console.warn = saveWarn;
        mockLocation.mockRestore();
    });
    it('renders Polish book', async () => {
        spyIsPolish.mockReturnValue(true);
        render(<Component />);
        await finishedRendering();
        spyIsPolish.mockReset();
        const jsonLdScript = document.head.querySelector('script');

        expect(jsonLdScript?.textContent).toEqual(
            expect.stringContaining('Polish')
        );
    });
    it('renders Polish book at phone width', async () => {
        spyWindowContext.mockReturnValue({innerWidth: 480} as any); // eslint-disable-line
        spyIsPolish.mockReturnValue(true);
        render(<Component />);
        await finishedRendering();
        spyIsPolish.mockReset();
        const jsonLdScript = document.head.querySelector('script');

        expect(jsonLdScript?.textContent).toEqual(
            expect.stringContaining('Polish')
        );
    });
    it('renders only phone-view at phone width', async () => {
        jest.spyOn(RBU, 'useResources').mockReturnValue({
            bookVideoFacultyResources: [],
            bookFacultyResources: [
                {
                    featured: true,
                    linkText: 'Link text',
                    comingSoonText: '',
                    printLink: 'print-link',
                    videoReferenceNumber: 13
                },
                {
                    featured: false,
                    linkText: 'Link text2',
                    comingSoonText: '',
                    printLink: 'print-link2',
                    videoReferenceNumber: null,
                    resource: {
                        id: 1,
                        heading: 'resource-heading',
                        resourceCategory: 'any',
                        resourceUnlocked: true,
                        description: 'resource-description'
                    }
                }
            ]
        });
        spyWindowContext.mockReturnValue({innerWidth: 480} as any); // eslint-disable-line
        render(<Component />);
        await finishedRendering();
        expect(lengthOfView('phone')).toBe(346);
        expect(lengthOfView('bigger')).toBeUndefined();

        jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
            y: 100
        } as any); // eslint-disable-line
        await user.click(screen.getByRole('button', {name: 'Instructor resources updated'}));
        console.warn = jest.fn();
        await user.click(await screen.findByRole('link', {name: 'OpenStax Partners'}));
        expect(console.warn).toHaveBeenCalled();
        console.warn = saveWarn;
    });
    it('toggles authors at phone width', async () => {
        spyWindowContext.mockReturnValue({innerWidth: 480} as any); // eslint-disable-line
        render(<Component />);
        await finishedRendering();
        const authorToggle = await screen.findByText('Authors');
        const detailsEl = authorToggle.closest('details');

        await user.click(authorToggle);
        expect(detailsEl?.open).toBe(true);
        await screen.findByText('Senior Contributing Authors');
    });
    it('handles missing description', async () => {
        document.head.removeChild(
            document.head.querySelector('meta[name="description"]') as Node
        );
        render(<Component />);
        await finishedRendering();
        expect(document.head.querySelector('script')).toBeNull();
    });
});
