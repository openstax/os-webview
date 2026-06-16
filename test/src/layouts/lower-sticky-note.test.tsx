import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as S from '~/layouts/default/shared';
import LowerStickyNote from '~/layouts/default/lower-sticky-note/lower-sticky-note';
import userEvent from '@testing-library/user-event';
import bannerData from '~/../../test/src/data/sticky-data';
import Cookies from 'js-cookie';

jest.mock('@openstax/experiments', () => ({
    enroll: jest.fn(({variants}) => variants[0])
}));

jest.mock('~/helpers/jit-load', () => ({
    __esModule: true,
    default: ({bannerInfo, PutAway}: {bannerInfo: {name: string}; PutAway: () => JSX.Element}) => (
        <div role="banner" data-testid="lsn">
            <PutAway />
            <span>{bannerInfo.name}</span>
        </div>
    )
}));

describe('lower-sticky-note', () => {
    const user = userEvent.setup();

    afterEach(() => {
        Cookies.remove('lower-sticky-note-closed');
        jest.restoreAllMocks();
    });

    it('renders the selected banner and closes, persisting dismissal to a cookie', async () => {
        jest.spyOn(S, 'useBannerData').mockReturnValue(bannerData);
        render(<MemoryRouter initialEntries={['/']}><LowerStickyNote /></MemoryRouter>);
        screen.getByTestId('lsn');

        await user.click(await screen.findByRole('button', {name: 'dismiss'}));
        expect(screen.queryByTestId('lsn')).toBeNull();
        expect(Cookies.get('lower-sticky-note-closed')).toBe('true');
    });

    it('stays hidden when the dismissal cookie is already set', () => {
        Cookies.set('lower-sticky-note-closed', 'true');
        jest.spyOn(S, 'useBannerData').mockReturnValue(bannerData);
        render(<MemoryRouter initialEntries={['/']}><LowerStickyNote /></MemoryRouter>);
        expect(screen.queryByTestId('lsn')).toBeNull();
    });

    it('renders nothing in emergency mode', () => {
        jest.spyOn(S, 'useBannerData').mockReturnValue({...bannerData, mode: 'emergency'});
        render(<MemoryRouter initialEntries={['/']}><LowerStickyNote /></MemoryRouter>);
        expect(screen.queryByTestId('lsn')).toBeNull();
    });

    it('renders nothing when no banner matches current path', () => {
        jest.spyOn(S, 'useBannerData').mockReturnValue({
            ...bannerData,
            bannerConfigs: [
                {...bannerData.bannerConfigs[0], 'context_filter': 'blog'}
            ]
        });
        render(<MemoryRouter initialEntries={['/']}><LowerStickyNote /></MemoryRouter>);
        expect(screen.queryByTestId('lsn')).toBeNull();
    });

    it('does not enroll in the experiment when mode is emergency', () => {
        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
        const {enroll} = require('@openstax/experiments');

        (enroll as jest.Mock).mockClear();
        jest.spyOn(S, 'useBannerData').mockReturnValue({
            ...bannerData,
            mode: 'emergency',
            bannerConfigs: [
                bannerData.bannerConfigs[0],
                {...bannerData.bannerConfigs[0], id: 2, name: 'Second'}
            ]
        });
        render(<MemoryRouter initialEntries={['/']}><LowerStickyNote /></MemoryRouter>);
        expect(enroll).not.toHaveBeenCalled();
    });
});
