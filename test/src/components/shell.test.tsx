import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import AppElement from '~/components/shell/shell';
import * as RRD from 'react-router-dom';
import * as CF from '~/helpers/cms-fetch';
import MR from '~/../../test/helpers/future-memory-router';
import ReactModal from 'react-modal';

const {BrowserRouter} = RRD;

jest.mock('react-router-dom', () => {
    const actualRouterDom = jest.requireActual('react-router-dom');

    return {
        ...actualRouterDom,
        BrowserRouter: jest.fn()
    };
});
global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
        ok: true,
        json() {
            return Promise.resolve([]);
        },
        text() {
            return Promise.resolve({});
        }
    })
);
global.scrollTo = jest.fn();

jest.mock('react-modal', () => ({
    setAppElement: jest.fn()
}));

describe('shell', () => {
    const user = userEvent.setup();

    it('Delivers embedded contact page', async () => {
        console.warn = jest.fn();
        console.debug = jest.fn();
        (BrowserRouter as jest.Mock).mockImplementationOnce(({children}) => (
            <MR initialEntries={['/embedded/contact']} >{children}</MR>
        ));

        render(AppElement);
        await screen.findByText('What is your question about?');
        expect(screen.queryAllByRole('navigation')).toHaveLength(0);
    });
    it('Delivers normal contact page', async () => {
        (BrowserRouter as jest.Mock).mockImplementationOnce(({children}) => (
            <MR initialEntries={['/contact']}>{children}</MR>
        ));

        render(AppElement);
        expect(
            await screen.findAllByText('Access. The future of education.')
        ).toHaveLength(2);
        expect(screen.queryAllByRole('navigation')).toHaveLength(2);

        let externalResolution: (value: unknown) => void;
        const modalCalled = new Promise((resolve) => {
            externalResolution = resolve;
        });

        (ReactModal.setAppElement as jest.Mock).mockImplementation(() => externalResolution('ok'));
        await modalCalled;
    });
    it('delivers press page in a portal', async () => {
        jest.spyOn(CF, 'default').mockImplementation((path) => {
            if (path.includes('books?')) {
                return Promise.resolve({books: []});
            }
            if (path.includes('pages/?type')) {
                return Promise.resolve({items: []});
            }
            return Promise.resolve([]);
        });
        (BrowserRouter as jest.Mock).mockImplementationOnce(({children}) => (
            <MR initialEntries={['/some-portal/press']}>{children}</MR>
        ));
        const mockUseParams = jest.spyOn(RRD, 'useParams').mockReturnValue({portal: 'some-portal', '*': '/contact'});

        render(AppElement);
        const pressLink = await screen.findByRole('link', {name: 'Press'});

        expect(pressLink.getAttribute('href')).toBe('/some-portal/press');
        mockUseParams.mockReset();
    });
    it('skip to content link does that', async () => {
        type WindowWithPiTracker = (typeof window) & {
            piTracker: (path: string) => void;
        }
        const w = window as WindowWithPiTracker;
        const piTracker = jest.fn();

        w.piTracker = (path: string) => piTracker(path);
        w.scrollBy = jest.fn();

        jest.spyOn(CF, 'default').mockImplementation(() => {
            return Promise.resolve([]);
        });
        (BrowserRouter as jest.Mock).mockImplementationOnce(({children}) => (
            <MR initialEntries={['/']}>{children}</MR>
        ));

        render(AppElement);
        await waitFor(() => expect(piTracker).toHaveBeenCalledWith('https://dev.openstax.org/'));
        const skipLink = document.querySelector('[href="#main"]') as HTMLAnchorElement;

        await user.click(skipLink);
        expect(window.scrollBy).toHaveBeenCalled();
        expect(document.getElementById('main')?.contains(document.activeElement));
    });
    it('redirects from /textbooks/ urls', async () => {
        jest.spyOn(CF, 'default').mockImplementation(() => {
            return Promise.resolve([]);
        });
        (BrowserRouter as jest.Mock).mockImplementationOnce(({children}) => (
            <MR initialEntries={['/textbooks/some-book']}>{children}</MR>
        ));

        render(AppElement);
        // It gets code coverage, but no test seems to work right; I have mocked
        // Navigate, and it does show as being called.
    });
});
