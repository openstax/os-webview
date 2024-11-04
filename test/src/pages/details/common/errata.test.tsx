import React from 'react';
import {render, screen} from '@testing-library/preact';
import ErrataSection from '~/pages/details/common/errata';
import ShellContextProvider from '../../../../helpers/shell-context';
import * as DC from '~/pages/details/context';
import * as I from 'react-intl';

const spyDetailsContext = jest.spyOn(DC, 'default');
const spyUseIntl = jest.spyOn(I, 'useIntl');

function Component() {
    return (
        <ShellContextProvider>
            <ErrataSection />
        </ShellContextProvider>
    );
}

describe('details/common/errata', () => {
    test('ErrataSection renders', async () => {
        spyDetailsContext.mockReturnValue({
            title: 'title',
            bookState: 'live',
            errataContent: 'A <b>blurb</b>'
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(<Component />);

        await screen.findByText('blurb');
    });
    test('ErrataSection is null if book has state unavailable', async () => {
        spyDetailsContext.mockReturnValue({
            title: 'title',
            bookState: 'retired',
            errataContent: 'A <b>blurb</b>'
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(<Component />);

        let caught = false;

        try {
            await screen.findByText('blurb');
        } catch (err) {
            caught = true;
        }
        expect(caught).toBe(true);
    });
    test('Erratasection is skipped if language is Spanish', async () => {
        spyDetailsContext.mockReturnValue({
            title: 'title',
            bookState: 'live',
            errataContent: 'A <b>blurb</b>'
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        spyUseIntl.mockReturnValue({
            locale: 'es',
            formatMessage: jest.fn()
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        render(<Component />);

        let caught = false;

        try {
            await screen.findByText('blurb');
        } catch (err) {
            caught = true;
        }
        expect(caught).toBe(true);
    });
});
