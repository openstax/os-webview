import React from 'react';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as S from '~/layouts/default/shared';
import LowerStickyNote from '~/layouts/default/lower-sticky-note/lower-sticky-note';
import userEvent from '@testing-library/user-event';
import bannerData from '~/../../test/src/data/sticky-data';
import Cookies from 'js-cookie';

jest.mock('~/helpers/jit-load', () => ({
    __esModule: true,
    default: ({bannerInfo}: {bannerInfo: {name: string}}) => (
        <div role="banner" data-testid="lsn">
            <button>close</button>
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

    it('renders the selected banner and closes', async () => {
        jest.spyOn(S, 'useBannerData').mockReturnValue(bannerData);
        render(<MemoryRouter initialEntries={['/']}><LowerStickyNote /></MemoryRouter>);
        const closeButton = await screen.findByRole('button');

        await user.click(closeButton);
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
                {...bannerData.bannerConfigs[0], context_filter: 'blog'}
            ]
        });
        render(<MemoryRouter initialEntries={['/']}><LowerStickyNote /></MemoryRouter>);
        expect(screen.queryByTestId('lsn')).toBeNull();
    });
});
