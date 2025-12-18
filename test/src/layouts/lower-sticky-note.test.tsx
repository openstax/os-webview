import React from 'react';
import {render, screen} from '@testing-library/preact';
import * as S from '~/layouts/default/shared';
import LowerStickyNote from '~/layouts/default/lower-sticky-note/lower-sticky-note';
import userEvent from '@testing-library/user-event';
import stickyData from '~/../../test/src/data/sticky-data';
import Cookies from 'js-cookie';

/* eslint-disable camelcase */
describe('lower-sticky-note', () => {
    const user = userEvent.setup();

    it('renders and closes', async () => {
        jest.spyOn(S, 'useStickyData').mockReturnValue(stickyData);
        render(<LowerStickyNote />);
        const closeButton = await screen.findByRole('button');

        await user.click(closeButton);
        Cookies.remove('lower-sticky-note-closed');
    });
    it('renders and closes', async () => {
        stickyData.bannerInfo.banner_thumbnail = '';
        jest.spyOn(S, 'useStickyData').mockReturnValue(stickyData);
        render(<LowerStickyNote />);
        const closeButton = await screen.findByRole('button');

        await user.click(closeButton);
    });
});
