import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import GiveBeforeOther from '~/pages/details/common/get-this-title-files/give-before-pdf/give-before-other';
import { MemoryRouter } from 'react-router-dom';
import * as TY from '~/pages/details/common/get-this-title-files/give-before-pdf/thank-you-form';

type PopupData = Parameters<typeof GiveBeforeOther>[0]['data'];

describe('give-before-other', () => {
    const close = jest.fn();
    const data = {} as unknown as PopupData; // doesn't matter
    const onDownload = jest.fn();
    const user = userEvent.setup();

    it('renders (variant unspecified)', async () => {
        render(
            <MemoryRouter initialEntries={['']}>
                <GiveBeforeOther
                    link='#gbo-link'
                    close={close}
                    data={data}
                    onDownload={onDownload}
                />
            </MemoryRouter>
        );
        const goLink = screen.getByText('Go to your item');

        await user.click(goLink);
        expect(close).toHaveBeenCalled();
        expect(onDownload).toHaveBeenCalled();
        jest.resetAllMocks();
    });
    it('renders (variant book), closes without onDownload', async () => {
        render(
            <MemoryRouter initialEntries={['']}>
                <GiveBeforeOther
                    link='#gbo-link'
                    close={close}
                    data={data}
                    variant='View online'
                    track='track-book'
                />
            </MemoryRouter>
        );
        const goLink = screen.getByText('Go to your book');

        await user.click(goLink);
        expect(close).toHaveBeenCalled();
        jest.resetAllMocks();
    });
    it('Shows ThankYou(variant resource)', async () => {
        jest.spyOn(TY, 'useOnThankYouClick').mockReturnValue({
            showThankYou: true,
            onThankYouClick: () => null
        });
        render(
            <MemoryRouter initialEntries={['']}>
                <GiveBeforeOther
                    link='#gbo-link'
                    close={close}
                    data={data}
                    onDownload={onDownload}
                    variant='Download resource'
                />
            </MemoryRouter>
        );
        expect(screen.getAllByRole('textbox')).toHaveLength(5);
        screen.getByText('Send us a thank you note');
    });
});
