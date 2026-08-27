import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import * as Sentry from '@sentry/react';
import {PageLoading} from '~/components/shell/router-helpers/page-loaders';

jest.mock('@sentry/react', () => ({captureException: jest.fn()}));

const captureException = Sentry.captureException as jest.Mock;

describe('shell/page-loaders', () => {
    let reload: jest.Mock;

    beforeEach(() => {
        captureException.mockClear();
        reload = jest.fn();
        Reflect.defineProperty(window, 'location', {
            writable: true,
            value: {origin: 'https://openstax.org', reload}
        });
        Reflect.defineProperty(window, 'sessionStorage', {
            writable: true,
            value: {getItem: () => null, setItem: () => undefined}
        });
    });

    it('renders nothing before the delay elapses', () => {
        const {container} = render(<PageLoading retry={jest.fn()} pastDelay={false} />);

        expect(container.innerHTML).toBe('');
        expect(captureException).not.toHaveBeenCalled();
    });

    it('shows the loader once the delay has passed', () => {
        const {container} = render(<PageLoading retry={jest.fn()} pastDelay={true} />);

        expect(container.querySelector('.os-loader')).toBeTruthy();
        expect(captureException).not.toHaveBeenCalled();
    });

    it('reloads instead of reporting when the page chunk went stale', () => {
        const staleChunk = new Error('Loading chunk 47 failed.');

        staleChunk.name = 'ChunkLoadError';
        render(<PageLoading error={staleChunk} retry={jest.fn()} />);

        expect(reload).toHaveBeenCalled();
        expect(captureException).not.toHaveBeenCalled();
    });

    it('reports any other failure and offers a retry', async () => {
        const retry = jest.fn();

        render(<PageLoading error={new Error('page blew up')} retry={retry} />);

        expect(captureException).toHaveBeenCalledWith(
            expect.objectContaining({message: 'page blew up'})
        );
        expect(reload).not.toHaveBeenCalled();

        await userEvent.click(screen.getByRole('button', {name: 'Try again'}));

        expect(retry).toHaveBeenCalled();
    });
});
