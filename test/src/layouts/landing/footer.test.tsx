import React from 'react';
import userEvent from '@testing-library/user-event';
import {render, screen, waitFor} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import { useContactDialog } from '~/layouts/landing/footer/flex';

jest.useFakeTimers();
const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

function ShowDialogWithParams() {
    const {ContactDialog, open: openContactDialog} = useContactDialog();
    const contactFormParams = [
        { key: 'userId', value: 'test' }
    ];

    return (
        <button onClick={openContactDialog}>
            Contact Us
            <ContactDialog contactFormParams={contactFormParams} />
        </button>
    );
}

describe('flex landing footer', () => {
    describe('contact dialog', () => {
        it('opens and closes', async () => {
            const getIframe = () => document.querySelector('iframe');

            render(
                <MemoryRouter initialEntries={['']}>
                    <ShowDialogWithParams />
                </MemoryRouter>
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
    });
});
