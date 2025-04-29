import React from 'react';
import {render, screen} from '@testing-library/preact';
import AppElement from '~/components/shell/shell';
import * as RRD from 'react-router-dom';
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
        (BrowserRouter as jest.Mock).mockImplementationOnce(({children}) => (
            <MR initialEntries={['/some-portal/press']}>{children}</MR>
        ));
        jest.spyOn(RRD, 'useParams').mockReturnValue({portal: 'some-portal', '*': '/contact'});

        render(AppElement);
        const pressLink = await screen.findByRole('link', {name: 'Press'});

        expect(pressLink.getAttribute('href')).toBe('/some-portal/press');
    });
});
