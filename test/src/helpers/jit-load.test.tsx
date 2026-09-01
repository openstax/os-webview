import React from 'react';
import {act, render, screen} from '@testing-library/preact';
import JITLoad, {DelayedFallback} from '~/helpers/jit-load';

type LazyModule = {default: React.FunctionComponent};

function deferredImport() {
    let resolve: (module: LazyModule) => void = () => undefined;
    const promise = new Promise<LazyModule>((res) => {
        resolve = res;
    });

    return {importFn: () => promise, resolve};
}

describe('helpers/jit-load', () => {
    describe('DelayedFallback', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('renders nothing until the delay elapses', () => {
            const {container} = render(<DelayedFallback />);

            expect(container.innerHTML).toBe('');
        });

        it('renders the placeholder once the delay elapses', () => {
            const {container} = render(<DelayedFallback />);

            act(() => {
                jest.runAllTimers();
            });

            expect(container.querySelector('.os-loader')).toBeTruthy();
            expect(container.querySelector('.os-loader--full-page')).toBeFalsy();
        });

        it('marks the placeholder full page when asked', () => {
            const {container} = render(<DelayedFallback fullPage />);

            act(() => {
                jest.runAllTimers();
            });

            expect(container.querySelector('.os-loader--full-page')).toBeTruthy();
        });
    });

    describe('JITLoad', () => {
        it('shows nothing until the default fallback delay elapses', async () => {
            const {importFn, resolve} = deferredImport();
            const {container} = render(<JITLoad importFn={importFn} />);

            expect(container.innerHTML).toBe('');

            resolve({default: () => <div>loaded</div>});
            await screen.findByText('loaded');
        });

        it('shows a custom fallback immediately while the chunk loads', async () => {
            const {importFn, resolve} = deferredImport();

            render(<JITLoad importFn={importFn} fallback={<div>custom fallback</div>} />);

            expect(screen.getByText('custom fallback')).toBeTruthy();

            resolve({default: () => <div>loaded</div>});
            await screen.findByText('loaded');
        });
    });
});
