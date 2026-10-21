import React from 'react';
import {render, screen} from '@testing-library/preact';
import useGiveToday from '~/models/give-today';
import Header from '~/layouts/landing/header/header';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import InPortal from '~/../../test/helpers/in-portal';
import type {LinkFields} from '@openstax/flex-page-renderer/components/Link';

jest.mock('~/models/give-today', () => jest.fn());

const GIVE_LINK = 'https://example.test/evergreen';

function renderHeader(props: Parameters<typeof Header>[0]) {
    return render(
        <ShellContextProvider>
            <Header {...props} />
        </ShellContextProvider>
    );
}

describe('landing Header', () => {
    beforeEach(() => {
        (useGiveToday as jest.Mock).mockReturnValue({default_give_link: GIVE_LINK});
    });

    it('points Give at the CMS default give link', () => {
        renderHeader({links: []});

        expect(
            screen.getByRole('link', {name: 'Give'}).getAttribute('href')
        ).toBe(GIVE_LINK);
    });

    it('omits Give when the page turns it off', () => {
        renderHeader({links: [], showGive: false});

        expect(screen.queryByRole('link', {name: 'Give'})).toBe(null);
    });

    it('uses the campaign link while a Give Today campaign is running', () => {
        (useGiveToday as jest.Mock).mockReturnValue({
            showButton: true,
            give_link: 'https://example.test/campaign',
            default_give_link: GIVE_LINK
        });
        renderHeader({links: []});

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
        renderHeader({links: []});

        expect(
            screen.getByRole('link', {name: 'Give'}).getAttribute('href')
        ).toBe(GIVE_LINK);
    });

    it('keeps site nav links in the portal, and leaves anchors and other sites alone', async () => {
        const links = [
            {text: 'Subjects', target: {type: 'internal', value: '/subjects'}},
            {text: 'FAQ', target: {type: 'anchor', value: '#faq'}},
            {text: 'Blog', target: {type: 'external', value: 'https://example.test/blog'}}
        ] as LinkFields[];

        render(
            <ShellContextProvider>
                <InPortal portal="my-portal">
                    <Header links={links} />
                </InPortal>
            </ShellContextProvider>
        );

        expect((await screen.findByRole('link', {name: 'Subjects'})).getAttribute('href'))
            .toBe('/my-portal/subjects');
        expect(screen.getByRole('link', {name: 'FAQ'}).getAttribute('href')).toBe('#faq');
        expect(screen.getByRole('link', {name: 'Blog'}).getAttribute('href')).toBe('https://example.test/blog');
        expect(screen.getByRole('link', {name: 'Give'}).getAttribute('href')).toBe(GIVE_LINK);
    });
});
