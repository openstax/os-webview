import React from 'react';
import {render, screen} from '@testing-library/preact';
import ErrataSection from '~/pages/details/common/errata';
import ShellContextProvider from '../../../../helpers/shell-context';
import InPortal from '../../../../helpers/in-portal';
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
    test('ErrataSection links to errata in the portal', async () => {
        spyDetailsContext.mockReturnValue({
            title: 'title',
            bookState: 'live',
            errataContent: 'A <b>blurb</b>'
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(
            <ShellContextProvider>
                <InPortal portal="my-portal">
                    <ErrataSection />
                </InPortal>
            </ShellContextProvider>
        );

        expect((await screen.findByRole('link', {name: 'Suggest a correction'})).getAttribute('href'))
            .toBe('/my-portal/errata/form?book=title');
        expect(screen.getByRole('link', {name: 'Errata list'}).getAttribute('href'))
            .toBe('/my-portal/errata/?book=title');
    });
    test('ErrataSection links to errata outside a portal that is not K12', async () => {
        spyDetailsContext.mockReturnValue({
            title: 'title',
            bookState: 'live',
            errataContent: 'A <b>blurb</b>'
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(
            <ShellContextProvider>
                <InPortal portal="my-portal" isK12Portal={false}>
                    <ErrataSection />
                </InPortal>
            </ShellContextProvider>
        );

        expect((await screen.findByRole('link', {name: 'Suggest a correction'})).getAttribute('href'))
            .toBe('/errata/form?book=title');
    });
    test('ErrataSection is null if book has state unavailable', async () => {
        spyDetailsContext.mockReturnValue({
            title: 'title',
            bookState: 'retired',
            errataContent: 'A <b>blurb</b>'
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(<Component />);

        await expect(screen.findByText('blurb')).rejects.toThrow();
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

        await expect(screen.findByText('blurb')).rejects.toThrow();
    });
});
