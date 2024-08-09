import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ContentWarning from '~/pages/details/common/get-this-title-files/give-before-pdf/content-warning';

jest.useFakeTimers();
const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
const close = jest.fn();
const onDownload = jest.fn();

describe('ContentWarning', () => {
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('displays and closes', async () => {
        render(
            <ContentWarning
                link='cw-link'
                track='cw-track'
                close={close}
                warning='cw-warning'
                id='cw-id'
            />
        );
        const goLink = (screen.getByRole('link'));

        expect(goLink.dataset.track).toBe('cw-track');
        expect(goLink.textContent).toBe('Go to your file');
        await user.click(goLink);
        jest.runAllTimers();
        expect(close).toHaveBeenCalled();
    });
    it('runs onDownload whe present', async () => {
        render(
            <ContentWarning
                link='cw-link'
                track=''
                close={close}
                onDownload={onDownload}
                warning='cw-warning'
                id='cw-id'
                variant='View online'
            />
        );
        const goLink = (screen.getByRole('link'));

        expect(goLink.textContent).toBe('Go to your book');
        await user.click(goLink);
        jest.runAllTimers();
        expect(close).toHaveBeenCalled();
        expect(onDownload).toHaveBeenCalled();
    });
});

// checkWarningCookie is exercised in other tests.
