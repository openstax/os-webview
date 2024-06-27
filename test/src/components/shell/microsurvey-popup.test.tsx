import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import {MemoryRouter} from 'react-router-dom';
import MicroSurvey from '~/components/shell/microsurvey-popup/microsurvey-popup';
import useMSQueue from '~/components/shell/microsurvey-popup/queue';
import useSharedDataContext from '~/contexts/shared-data';

jest.mock('~/components/shell/microsurvey-popup/queue', () => jest.fn());
jest.mock('~/contexts/shared-data', () => jest.fn());

jest.useFakeTimers();

describe('microsurvey-popup', () => {
    it('renders without sticky footer', () => {
        (useMSQueue as jest.Mock).mockReturnValue(['item', () => null]);
        (useSharedDataContext as jest.Mock).mockReturnValue({
            flags: {},
            stickyFooterState: [true]
        });
        render(
            <ShellContextProvider>
                <MemoryRouter initialEntries={['/']}>
                    <MicroSurvey />
                </MemoryRouter>
            </ShellContextProvider>
        );
        jest.runAllTimers();
        expect(document.getElementById('microsurvey')).toBeTruthy();
    });
    it('renders with sticky footer', () => {
        (useMSQueue as jest.Mock).mockReturnValue([null, () => null]);
        (useSharedDataContext as jest.Mock).mockReturnValue({
            flags: {},
            stickyFooterState: [null]
        });

        render(
            <ShellContextProvider>
                <MemoryRouter initialEntries={['/']}>
                    <MicroSurvey />
                    <div className="sticky-footer" />
                </MemoryRouter>
            </ShellContextProvider>
        );
        jest.runAllTimers();
        expect(document.getElementById('microsurvey')).toBeNull();
    });
});
