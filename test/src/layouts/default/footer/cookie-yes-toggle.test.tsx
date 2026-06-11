import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import CookieYesToggle from '~/layouts/default/footer/cookie-yes-toggle';

describe('CookieYesToggle', () => {
    beforeEach(() => {
        delete (window as any).getCkyConsent;
    });

    it('does not render when cookieyes_banner_load has not fired', () => {
        const {container} = render(<CookieYesToggle />);

        expect(container.querySelector('button')).toBeNull();
    });

    it('does not render when getCkyConsent is not in window', () => {
        const {container} = render(<CookieYesToggle />);

        document.dispatchEvent(new Event('cookieyes_banner_load'));

        expect(container.querySelector('button')).toBeNull();
    });

    it('renders button when cookieyes loads and getCkyConsent exists', async () => {
        (window as any).getCkyConsent = jest.fn();

        const {container} = render(<CookieYesToggle />);

        expect(container.querySelector('button')).toBeNull();

        document.dispatchEvent(new Event('cookieyes_banner_load'));

        await waitFor(() => {
            expect(screen.getByText('Manage cookies')).toBeInTheDocument();
        });

        const button = container.querySelector('button');

        expect(button).not.toBeNull();
        expect(button?.className).toBe('cky-banner-element small');
        expect(button?.type).toBe('button');
    });

    it('does not re-render when already loaded', async () => {
        (window as any).getCkyConsent = jest.fn();

        const {container} = render(<CookieYesToggle />);

        document.dispatchEvent(new Event('cookieyes_banner_load'));

        await waitFor(() => {
            expect(screen.getByText('Manage cookies')).toBeInTheDocument();
        });

        const firstButton = container.querySelector('button');

        document.dispatchEvent(new Event('cookieyes_banner_load'));

        await waitFor(() => {
            const buttons = container.querySelectorAll('button');

            expect(buttons.length).toBe(1);
        });

        const secondButton = container.querySelector('button');

        expect(firstButton).toBe(secondButton);
    });

    it('cleans up event listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        const {unmount} = render(<CookieYesToggle />);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'cookieyes_banner_load',
            expect.any(Function)
        );
    });
});
