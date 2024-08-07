import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import GiveBeforePdf from '~/pages/details/common/get-this-title-files/give-before-pdf/give-before-pdf';
// eslint-disable-next-line max-len
import type {DonationPopupData} from '~/pages/details/common/get-this-title-files/give-before-pdf/use-donation-popup-data';
import * as TY from '~/pages/details/common/get-this-title-files/give-before-pdf/thank-you-form';

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

describe('give-before-pdf', () => {
    afterEach(() => {
        jest.resetAllMocks();
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
        jest.spyOn(TY, 'useOnThankYouClick').mockReturnValue({
            showThankYou: true,
            onThankYouClick: () => null
        });
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
        jest.runAllTimers();
        await screen.findByText('Send us a thank you note');
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
                    track='something'
                />
            </MemoryRouter>
        );
        screen.getByText('Downloading...');
        jest.runAllTimers();
        const goLink = await screen.findByText('Go to your file');

        await user.click(goLink);
        jest.runAllTimers();
        expect(onDownload).toHaveBeenCalled();
    });
    it('Handle close without onDownload', async () => {
        expect(close).not.toHaveBeenCalled();
        render(
            <MemoryRouter initialEntries={['']}>
                <GiveBeforePdf
                    link="gbp-link"
                    close={close}
                    data={data}
                />
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
                <GiveBeforePdf
                    link="gbp-link"
                    close={close}
                    data={data}
                />
            </MemoryRouter>
        );
        screen.getByText('Downloading...');
        jest.runAllTimers();
        await user.click(await screen.findByText('Go to your file'));
        jest.runAllTimers();
        const links = screen.getAllByRole('link');

        expect(links.length).toBe(2);
        await user.click(links[0]);
    });
});
