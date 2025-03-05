import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import AppElement from '~/components/shell/shell';
import {BrowserRouter, MemoryRouter as MR} from 'react-router-dom';
import ReactModal from 'react-modal';

// @ts-expect-error does not exist on
const {routerFuture} = global;

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
            <MR initialEntries={['/embedded/contact']} future={routerFuture}>{children}</MR>
        ));

        render(AppElement);
        await screen.findByText('What is your question about?');
        expect(screen.queryAllByRole('navigation')).toHaveLength(0);
    });
    it('Delivers normal contact page', async () => {
        (BrowserRouter as jest.Mock).mockImplementationOnce(({children}) => (
            <MR initialEntries={['/contact']} future={routerFuture}>{children}</MR>
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
});
