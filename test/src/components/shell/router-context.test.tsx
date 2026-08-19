import React from 'react';
import {render, screen} from '@testing-library/preact';
import * as Sentry from '@sentry/react';
import {RouterContextProvider} from '~/components/shell/router-context';

jest.mock('@sentry/react', () => ({captureException: jest.fn()}));

const captureException = Sentry.captureException as jest.Mock;

// Throws once and then renders. A component that throws on every attempt
// re-throws past the boundary instead of being caught.
function Boom({error}: {error: Error}) {
    const thrown = React.useRef(false);

    if (!thrown.current) {
        thrown.current = true;
        throw error;
    }

    return <div>recovered</div>;
}

function renderWithBoundary(error: Error) {
    return render(
        <RouterContextProvider>
            <Boom error={error} />
        </RouterContextProvider>
    );
}

describe('shell/router-context', () => {
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

    it('reports a render error to Sentry', async () => {
        renderWithBoundary(new Error('render blew up'));
        await screen.findByText('recovered');
        expect(captureException).toHaveBeenCalledWith(
            expect.objectContaining({message: 'render blew up'})
        );
    });

    it('reloads instead of reporting when a chunk went stale', async () => {
        const staleChunk = new Error('Loading chunk 47 failed.');

        staleChunk.name = 'ChunkLoadError';
        renderWithBoundary(staleChunk);
        await screen.findByText('recovered');
        expect(reload).toHaveBeenCalled();
        expect(captureException).not.toHaveBeenCalled();
    });
});
