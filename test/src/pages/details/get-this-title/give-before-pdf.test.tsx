import React from 'react';
import {fireEvent, render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {LanguageContextProvider} from '~/contexts/language';
import GiveBeforePdf from '~/pages/details/common/get-this-title-files/give-before-pdf/give-before-pdf';
// eslint-disable-next-line max-len
import type {DonationPopupData} from '~/pages/details/common/get-this-title-files/give-before-pdf/use-donation-popup-data';
import * as TY from '~/pages/details/common/get-this-title-files/give-before-pdf/thank-you-form';

jest.mock('~/helpers/main-class-hooks', () => ({
    useMainSticky: () => jest.fn()
}));

jest.useFakeTimers();
const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
const close = jest.fn();
const onDownload = jest.fn();
/* eslint-disable camelcase */
const data: DonationPopupData = {
    download_ready: 'your download is ready',
    header_subtitle: 'header-subtitle',
    download_image: 'image-url'
} as unknown as DonationPopupData; // doesn't matter
/* eslint-enable camelcase */

function ShowThankYouButton({children}: React.PropsWithChildren<object>) {
    const {showThankYou, onThankYouClick} = TY.useOnThankYouClick();

    if (showThankYou) {
        return children;
    }
    return <button onClick={onThankYouClick}>Show thank you</button>;
}

describe('give-before-pdf', () => {
    const originalError = console.error;

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders after download delay', async () => {
        render(
            <MemoryRouter initialEntries={['']}>
                <GiveBeforePdf
                    link="gbp-link"
                    close={close}
                    data={data}
                    onDownload={onDownload}
                />
            </MemoryRouter>
        );
        screen.getByText('Downloading...');
        jest.runAllTimers();
        await screen.findByText('your download is ready');
    });
    it('shows Thank You', async () => {
        render(
            <LanguageContextProvider>
                <ShowThankYouButton>
                    <MemoryRouter initialEntries={['']}>
                        <GiveBeforePdf
                            link="gbp-link"
                            close={close}
                            data={data}
                            onDownload={onDownload}
                        />
                    </MemoryRouter>
                </ShowThankYouButton>
            </LanguageContextProvider>
        );
        await user.click(await screen.findByRole('button'));
        await screen.findByText('Go to your file');
    });
    it('Thank You note can be filled and submitted', async () => {
        const thankYouClick = jest.fn();

        jest.spyOn(TY, 'useOnThankYouClick').mockReturnValue({
            showThankYou: true,
            onThankYouClick: () => thankYouClick()
        });
        render(
            <LanguageContextProvider>
                <MemoryRouter initialEntries={['']}>
                    <GiveBeforePdf
                        link="gbp-link"
                        close={close}
                        data={data}
                        onDownload={onDownload}
                        track="thanks"
                    />
                </MemoryRouter>
            </LanguageContextProvider>
        );
        jest.runAllTimers();
        await screen.findByRole('heading', {
            level: 1,
            name: 'Send us a thank you note'
        });
        screen.getAllByRole('textbox').forEach((el) => {
            fireEvent.input(el, {target: {value: 'Casper College'}});
        });
        await user.click(screen.getByRole('checkbox'));
        console.error = jest.fn();
        // This is the submit button, but submit doesn't work in testing :(
        await user.click(screen.getByRole('button'));
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining(
                'Not implemented: HTMLFormElement.prototype.submit'
            ),
            undefined
        );
        // So we can test the "never mind" link
        await user.click(screen.getByRole('link'));
        // Even firing the submit event doesn't cause anything to happen?
        fireEvent.submit(screen.getByRole('form'));
        // So we directly fire the load on the form target iframe
        fireEvent.load(screen.getByTitle('form-response'));
    });
    it('Exercise data-track and datalayer effect', async () => {
        (window as unknown as Window & {dataLayer: object[]}).dataLayer = [];
        render(
            <MemoryRouter initialEntries={['']}>
                <GiveBeforePdf
                    link="gbp-link"
                    close={close}
                    data={data}
                    onDownload={onDownload}
                    track="something"
                />
            </MemoryRouter>
        );
        screen.getByText('Downloading...');
        jest.runAllTimers();
        const goLink = await screen.findByText('Go to your file');

        await user.click(goLink);
        jest.runAllTimers();
        expect(onDownload).toHaveBeenCalled();
        jest.resetAllMocks();
    });
    it('Handle close without onDownload', async () => {
        expect(close).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries={['']}>
                <GiveBeforePdf link="gbp-link" close={close} data={data} />
            </MemoryRouter>
        );
        screen.getByText('Downloading...');
        jest.runAllTimers();
        await user.click(await screen.findByText('Go to your file'));
        jest.runAllTimers();
        expect(close).toHaveBeenCalled();
    });
    it('handles Give link click', async () => {
        render(
            <MemoryRouter initialEntries={['/k12/something']}>
                <GiveBeforePdf link="gbp-link" close={close} data={data} />
            </MemoryRouter>
        );
        screen.getByText('Downloading...');
        jest.runAllTimers();
        await user.click(await screen.findByText('Go to your file'));
        jest.runAllTimers();
        const links = screen.getAllByRole('link');

        expect(links.length).toBe(2);
        console.error = jest.fn();
        await user.click(links[0]);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Not implemented: window.open'),
            undefined
        );
        console.error = originalError;
    });
});
