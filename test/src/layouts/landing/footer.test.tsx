import React from 'react';
import userEvent from '@testing-library/user-event';
import {render, screen, waitFor} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import MR from '~/../../test/helpers/future-memory-router';
import { useContactDialog } from '~/layouts/landing/footer/flex';

const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

function ShowContactDialog(props: Parameters<ReturnType<typeof useContactDialog>['ContactDialog']>[0]) {
    const {ContactDialog, open: openContactDialog} = useContactDialog();

    return (
        <button onClick={openContactDialog}>
            Contact Us
            <ContactDialog {...props} />
        </button>
    );
}

describe('flex landing footer', () => {
    describe('contact dialog', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        const getIframe = () => document.querySelector('iframe');

        it('opens and closes', async () => {
            const contactFormParams = [
                { key: 'userId', value: 'test' }
            ];

            render(
                <MR initialEntries={['']}>
                    <ShowContactDialog contactFormParams={contactFormParams} />
                </MR>
            );
            expect(getIframe()).toBeNull();
            await user.click(await screen.findByText('Contact Us'));
            expect(getIframe()?.src.endsWith('body=userId%3Dtest')).toBe(true);

            jest.useRealTimers();

            // Should do nothing
            window.postMessage('Some Other Message', '*');

            // Should close the dialog
            window.postMessage('CONTACT_FORM_SUBMITTED', '*');
            await waitFor(() => expect(getIframe()).toBeNull());
        });
        it('handles undefined contactFormParams', async () => {
            render(
                <MR initialEntries={['']}>
                    <ShowContactDialog />
                </MR>
            );
            expect(getIframe()).toBeNull();
            await user.click(await screen.findByText('Contact Us'));
            expect(getIframe()?.src.endsWith('embedded/contact')).toBe(true);
        });
    });
});
