import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';

// The real router chunk resolves too fast under Jest's module cache to
// reliably catch mid-flight, so JITLoad is replaced with a stand-in that
// renders whatever fallback it was given, making the wiring deterministic.
// jest.mock factories can't reference out-of-scope imports, hence the
// requires (and createElement over JSX) inside each factory.
jest.mock('~/helpers/jit-load', () => {
    const {createElement, Fragment} = require('react');
    const actual = jest.requireActual('~/helpers/jit-load');

    return {
        __esModule: true,
        DelayedFallback: actual.DelayedFallback,
        default: ({fallback}: {fallback: React.ReactNode}) => createElement(Fragment, null, fallback)
    };
});
jest.mock('~/layouts/default/header/header', () => {
    const {createElement} = require('react');

    return {
        __esModule: true,
        default: () => createElement('div', null, 'mock-header')
    };
});

import AppElement from '~/components/shell/shell';

describe('shell router fallback', () => {
    it('renders the real header above the delayed placeholder while the router chunk loads', () => {
        render(AppElement);

        expect(document.querySelector('#header')).toBeTruthy();
        expect(screen.getByText('mock-header')).toBeInTheDocument();
    });
});
