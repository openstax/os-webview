import React from 'react';
import {render, screen} from '@testing-library/preact';
import * as S from '~/layouts/default/shared';
import LowerStickyNote from '~/layouts/default/lower-sticky-note/lower-sticky-note';
import userEvent from '@testing-library/user-event';
import Cookies from 'js-cookie';

/* eslint-disable camelcase */
const stickyData = {
    mode: 'banner',
    start: '2024-05-10T15:00:00Z',
    expires: '2025-10-01T19:58:00Z',
    show_popup: false,
    header: 'Normal sticky',
    body: 'By giving $1, $5, or $10 you can make a meaningful impact...',
    link_text: 'Give now',
    link: 'https://google.com',
    emergency_expires: '2023-01-17T02:00:00Z',
    emergency_content:
        'The OpenStax offices will be closed January 16 in observance of Martin Luther King, Jr. Day.',
    bannerInfo: {
        html_message:
            'Help students around the world succeed with <strong>contributions of $5, $10 or $20</strong>',
        link_text: 'Make a difference now',
        link_url: 'https://dev.openstax.org/give',
        banner_thumbnail:
            'https://assets.openstax.org/oscms-dev/media/original_images/subj-icon-science.png'
    }
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

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
