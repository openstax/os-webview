import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import '@testing-library/jest-dom';
import {IntlProvider} from 'react-intl';
import OrderPrintCopy from '~/pages/details/common/get-this-title-files/order-print-copy/order-print-copy';
import * as cmsFetch from '~/helpers/cms-fetch';
import * as posthog from '~/helpers/posthog';

function Wrapper({children}: {children: React.ReactNode}) {
    return (
        <IntlProvider locale="en" messages={{}}>
            {children}
        </IntlProvider>
    );
}

describe('OrderPrintCopy', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('does not render when no links are available', async () => {
        jest.spyOn(cmsFetch, 'default').mockResolvedValue({
            amazon_link: null,
            audiobook_link: null
        });

        const {container} = render(
            <Wrapper>
                <OrderPrintCopy slug="test-book" campaign="book-details" />
            </Wrapper>
        );

        await waitFor(() => {
            expect(cmsFetch.default).toHaveBeenCalledWith('test-book');
        });

        expect(container.querySelector('.order-print-copy')).toBeNull();
    });

    it('renders only audiobook link when bookstore link is missing', async () => {
        jest.spyOn(cmsFetch, 'default').mockResolvedValue({
            amazon_link: null,
            audiobook_link: 'https://example.com/audiobook'
        });

        const {container} = render(
            <Wrapper>
                <OrderPrintCopy slug="test-book" campaign="book-details" />
            </Wrapper>
        );

        await waitFor(() => {
            const boxes = container.querySelectorAll('.box');

            // 1 content item renders in both phone and desktop versions = 2 boxes total
            expect(boxes.length).toBe(2);
        });

        const audiobookLink = screen.getByRole('link', {name: /audiobook/i});

        expect(audiobookLink).toBeInTheDocument();
        expect(audiobookLink.getAttribute('href')).toBe('https://example.com/audiobook');
        expect(audiobookLink.getAttribute('data-track')).toBe('Audiobook');
    });

    it('renders only bookstore links when audiobook link is missing', async () => {
        jest.spyOn(cmsFetch, 'default').mockResolvedValue({
            amazon_link: 'https://example.com/amazon',
            audiobook_link: null
        });

        const {container} = render(
            <Wrapper>
                <OrderPrintCopy slug="test-book" campaign="book-details" />
            </Wrapper>
        );

        await waitFor(() => {
            const boxes = container.querySelectorAll('.box');

            expect(boxes.length).toBeGreaterThan(0);
        });

        const individualLink = screen.getByRole('link', {name: /Buy a print copy/i});
        const bookstoreLink = screen.getByRole('link', {name: /Order options/i});

        expect(individualLink).toBeInTheDocument();
        expect(bookstoreLink).toBeInTheDocument();
        expect(individualLink.getAttribute('href')).toContain('example.com/amazon');
        expect(individualLink.getAttribute('href')).toContain('utm_campaign=book-details');
        expect(individualLink.getAttribute('data-track')).toBe('Print');
    });

    it('renders both audiobook and bookstore links when both are available', async () => {
        jest.spyOn(cmsFetch, 'default').mockResolvedValue({
            amazon_link: 'https://example.com/amazon',
            audiobook_link: 'https://example.com/audiobook'
        });

        const {container} = render(
            <Wrapper>
                <OrderPrintCopy slug="test-book" campaign="book-details" />
            </Wrapper>
        );

        await waitFor(() => {
            const boxes = container.querySelectorAll('.box');

            // 3 content items render in both phone and desktop versions = 6 boxes total
            expect(boxes.length).toBe(6);
        });

        const audiobookLink = screen.getByRole('link', {name: /audiobook/i});
        const individualLink = screen.getByRole('link', {name: /Buy a print copy/i});
        const bookstoreLink = screen.getByRole('link', {name: /Order options/i});

        expect(audiobookLink).toBeInTheDocument();
        expect(individualLink).toBeInTheDocument();
        expect(bookstoreLink).toBeInTheDocument();
    });

    it('renders correct number of boxes in phone and desktop versions', async () => {
        jest.spyOn(cmsFetch, 'default').mockResolvedValue({
            amazon_link: 'https://example.com/amazon',
            audiobook_link: 'https://example.com/audiobook'
        });

        const {container} = render(
            <Wrapper>
                <OrderPrintCopy slug="test-book" campaign="book-details" />
            </Wrapper>
        );

        await waitFor(() => {
            const phoneBoxes = container.querySelector('.phone-version.boxes-3');
            const desktopBoxes = container.querySelector('.larger-version.boxes-3');

            expect(phoneBoxes).toBeInTheDocument();
            expect(desktopBoxes).toBeInTheDocument();
        });
    });

    it('applies utm_campaign to bookstore link', async () => {
        jest.spyOn(cmsFetch, 'default').mockResolvedValue({
            amazon_link: 'https://example.com/amazon?existing=param',
            audiobook_link: null
        });

        render(
            <Wrapper>
                <OrderPrintCopy slug="test-book" campaign="subjects-dropdown" />
            </Wrapper>
        );

        await waitFor(() => {
            const individualLink = screen.getByRole('link', {name: /Buy a print copy/i});

            expect(individualLink.getAttribute('href')).toContain('utm_campaign=subjects-dropdown');
        });
    });

    it('has correct aria labels and data attributes', async () => {
        jest.spyOn(cmsFetch, 'default').mockResolvedValue({
            amazon_link: 'https://example.com/amazon',
            audiobook_link: null
        });

        const {container} = render(
            <Wrapper>
                <OrderPrintCopy slug="test-book" campaign="book-details" />
            </Wrapper>
        );

        await waitFor(() => {
            const nav = container.querySelector('nav.order-print-copy');

            expect(nav).toBeInTheDocument();
            expect(nav?.getAttribute('aria-label')).toBe('Order print copy Navigation');
            expect(nav?.getAttribute('data-analytics-nav')).toBe('Order print copy');
        });
    });

    it('captures click events for phone and desktop print copy links', async () => {
        const captureEventSpy = jest.spyOn(posthog, 'captureEvent').mockImplementation(() => undefined);
        jest.spyOn(cmsFetch, 'default').mockResolvedValue({
            amazon_link: 'https://example.com/amazon',
            audiobook_link: 'https://example.com/audiobook'
        });

        const {container} = render(
            <Wrapper>
                <OrderPrintCopy slug="test-book" campaign="book-details" />
            </Wrapper>
        );

        await waitFor(() => {
            expect(container.querySelector('.phone-version .box[data-track=\"Audiobook\"]')).toBeInTheDocument();
            expect(container.querySelector('.larger-version .btn[data-track=\"Print\"]')).toBeInTheDocument();
        });

        (container.querySelector('.phone-version .box[data-track=\"Audiobook\"]') as HTMLAnchorElement).click();
        (container.querySelector('.larger-version .btn[data-track=\"Print\"]') as HTMLAnchorElement).click();

        expect(captureEventSpy).toHaveBeenNthCalledWith(1, 'print_copy_clicked', {format: 'Audiobook'});
        expect(captureEventSpy).toHaveBeenNthCalledWith(2, 'print_copy_clicked', {format: 'Print'});
    });
});
