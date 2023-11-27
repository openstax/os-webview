import React from 'react';
import {describe, it} from '@jest/globals';
import {render} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import WebinarsLoader from '~/pages/webinars/webinars';

function Component({path}: {path: string}) {
    return (
        <MemoryRouter basename='/webinars' initialEntries={[path]}>
            <WebinarsLoader />
        </MemoryRouter>
    );
}

jest.mock('~/pages/webinars/webinar-context', () => ({
    WebinarContextProvider: jest.fn(({children}) => children)
}));
jest.mock('~/helpers/jit-load', () => jest.fn(({importFn}) => importFn()));

describe('webinars router', () => {
    it('renders the main page', () => {
        render(<Component path='/webinars' />);
    });
    it('renders the explore page', () => {
        render(<Component path='/webinars/explore/some/topic' />);
    });
    it('renders the upcoming page', () => {
        render(<Component path='/webinars/upcoming' />);
    });
    it('renders the latest page', () => {
        render(<Component path='/webinars/latest' />);
    });
    it('renders the search page', () => {
        render(<Component path='/webinars/search' />);
    });
});
