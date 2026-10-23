import React from 'react';
import userEvent from '@testing-library/user-event';
import {render, screen, waitFor} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import MR from '~/../../test/helpers/future-memory-router';
import FooterLoader, { useContactDialog } from '~/layouts/landing/footer/flex';
import * as PC from '~/contexts/portal';
import {assertNotNull} from '~/helpers/data';

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
        it('tells the form the portal, before the other params', async () => {
            render(
                <MR initialEntries={['']}>
                    <ShowContactDialog contactFormParams={[{key: 'userId', value: 'test'}]} portal="school-portal" />
                </MR>
            );
            await user.click(await screen.findByText('Contact Us'));
            expect(getIframe()?.src.endsWith('embedded/contact?portal=school-portal&body=userId%3Dtest')).toBe(true);
        });
        it('tells the form the portal when there are no other params', async () => {
            render(
                <MR initialEntries={['']}>
                    <ShowContactDialog portal="school-portal" />
                </MR>
            );
            await user.click(await screen.findByText('Contact Us'));
            expect(getIframe()?.src.endsWith('embedded/contact?portal=school-portal')).toBe(true);
        });
    });
});

describe('flex landing footer portal', () => {
    beforeEach(() => {
        // The contact dialog tests above leave fake timers on
        jest.useRealTimers();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    function mockPortal(portalPrefix: string, isK12Portal: boolean) {
        jest.spyOn(PC, 'default').mockReturnValue({
            portalPrefix,
            linkPrefix: isK12Portal ? portalPrefix : '',
            setPortal: jest.fn(),
            hrefInPortal: jest.fn(),
            rewriteLinks: jest.fn(),
            isK12Portal,
            setIsK12Portal: jest.fn()
        });
    }

    async function contactFormUrl() {
        render(
            <MR initialEntries={['']}>
                <FooterLoader />
            </MR>
        );
        await userEvent.click(await screen.findByText('Contact Us'));

        return new URL(assertNotNull(document.querySelector('iframe')).src);
    }

    it('tells the contact form the portal in a K12 portal', async () => {
        mockPortal('/school-portal', true);

        expect((await contactFormUrl()).searchParams.get('portal')).toBe('school-portal');
    });

    it.each([
        ['another portal', '/landing-page', false],
        ['no portal', '', true]
    ])('does not tell the contact form a portal in %s', async (_, portalPrefix, isK12Portal) => {
        mockPortal(portalPrefix, isK12Portal);

        expect((await contactFormUrl()).searchParams.has('portal')).toBe(false);
    });
});
