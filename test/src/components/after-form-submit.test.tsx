import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import {describe, it, expect} from '@jest/globals';
import * as Sentry from '@sentry/react';
import * as PostHog from '~/helpers/posthog-exceptions';
import {useAfterSubmit} from '~/components/book-selector/after-form-submit';
import type {SalesforceBook} from '~/helpers/books';

const mockNavigate = jest.fn();
const mockFetchBooks = jest.fn();

jest.mock('@sentry/react', () => ({captureException: jest.fn()}));
jest.mock('~/models/books', () => ({
    __esModule: true,
    default: () => mockFetchBooks()
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({search: '?Calculus'})
}));
jest.mock('~/contexts/portal', () => ({
    __esModule: true,
    default: () => ({linkPrefix: ''})
}));

const reportToPostHog = jest.spyOn(PostHog, 'captureException');
const selectedBooks = [{value: 'Calculus [Spanish]'}] as SalesforceBook[];

function Submitter() {
    const selectedBooksRef = React.useRef(selectedBooks);
    const afterSubmit = useAfterSubmit(selectedBooksRef);

    React.useEffect(() => afterSubmit(), [afterSubmit]);
    return null;
}

describe('after-form-submit', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        reportToPostHog.mockClear();
        (Sentry.captureException as jest.Mock).mockClear();
    });

    it('navigates with the slug of the preselected book', async () => {
        mockFetchBooks.mockResolvedValue([
            {'salesforce_abbreviation': 'Calculus', 'book_state': 'live', slug: 'calculus-volume-1'}
        ]);
        render(<Submitter />);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/partners', {
            state: {confirmation: true, book: ['Calculus'], slug: 'calculus-volume-1'}
        }));
    });

    it('still navigates, and reports, when the book list fails', async () => {
        const failure = new Error('Failed to fetch books?format=json');

        mockFetchBooks.mockRejectedValue(failure);
        render(<Submitter />);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/partners', {
            state: {confirmation: true, book: ['Calculus'], slug: undefined}
        }));
        expect(Sentry.captureException).toHaveBeenCalledWith(failure);
        expect(reportToPostHog).toHaveBeenCalledWith(failure);
    });
});
