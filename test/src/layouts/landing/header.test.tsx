import React from 'react';
import {render, screen} from '@testing-library/preact';
import useGiveToday from '~/models/give-today';
import Header from '~/layouts/landing/header/header';

jest.mock('~/models/give-today', () => jest.fn());

const GIVE_LINK = 'https://example.test/evergreen';

describe('landing Header', () => {
    beforeEach(() => {
        (useGiveToday as jest.Mock).mockReturnValue({default_give_link: GIVE_LINK});
    });

    it('points Give at the CMS default give link', () => {
        render(<Header links={[]} />);

        expect(
            screen.getByRole('link', {name: 'Give'}).getAttribute('href')
        ).toBe(GIVE_LINK);
    });

    it('omits Give when the page turns it off', () => {
        render(<Header links={[]} showGive={false} />);

        expect(screen.queryByRole('link', {name: 'Give'})).toBe(null);
    });

    it('uses the campaign link while a Give Today campaign is running', () => {
        (useGiveToday as jest.Mock).mockReturnValue({
            showButton: true,
            give_link: 'https://example.test/campaign',
            default_give_link: GIVE_LINK
        });
        render(<Header links={[]} />);

        expect(
            screen.getByRole('link', {name: 'Give'}).getAttribute('href')
        ).toBe('https://example.test/campaign');
    });

    it('ignores a campaign whose link was left blank', () => {
        (useGiveToday as jest.Mock).mockReturnValue({
            showButton: true,
            give_link: '',
            default_give_link: GIVE_LINK
        });
        render(<Header links={[]} />);

        expect(
            screen.getByRole('link', {name: 'Give'}).getAttribute('href')
        ).toBe(GIVE_LINK);
    });
});
