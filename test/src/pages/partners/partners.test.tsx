import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {SearchContextProvider} from '~/pages/partners/search-context';
import {MemoryRouter} from 'react-router-dom';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import Partners from '~/pages/partners/partners';
import Results from '~/pages/partners/results/results';
import sfPartners from '../../data/salesforce-partners';
import * as MC from '~/contexts/main-class';
import * as DH from '~/helpers/use-document-head';
import * as UC from '~/contexts/user';

// @ts-expect-error does not exist on
const {routerFuture} = global;

jest.mock('~/helpers/main-class-hooks', () => ({
    useMainSticky: () => jest.fn()
}));
jest.spyOn(MC, 'default').mockReturnValue({
    setModal: () => null,
    setSticky: () => null,
    classes: []
});
jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();
jest.spyOn(UC, 'UserContextProvider').mockImplementation(
    ({children}: any) => children // eslint-disable-line
);

const mockSfPartners = jest.fn();

jest.mock('~/models/salesforce-partners', () => ({
    __esModule: true,
    get default(): Promise<typeof sfPartners> {
        return mockSfPartners();
    }
}));

// react-aria-carousel does not play nice with Jest
jest.mock('react-aria-carousel', () => ({
    Carousel: jest.fn()
}));

describe('partners/results', () => {
    const linkTexts = {
        websiteLinkText: 'web link',
        infoLinkText: 'info link'
    };

    function Component() {
        return (
            <MemoryRouter initialEntries={['/partners']} future={routerFuture}>
                <SearchContextProvider>
                    <Results linkTexts={linkTexts} />
                </SearchContextProvider>
            </MemoryRouter>
        );
    }

    it('returns nothing until data arrives', async () => {
        mockSfPartners.mockResolvedValue(undefined);
        const {container} = render(<Component />);

        expect(container.textContent).toBe('');
    });
});

describe('partners full page', () => {
    const user = userEvent.setup();

    function Component() {
        return (
            <ShellContextProvider>
                <MemoryRouter initialEntries={['/partners']} future={routerFuture}>
                    <Partners />
                </MemoryRouter>
            </ShellContextProvider>
        );
    }

    jest.setTimeout(12000);
    it('displays grid that filters by type', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const buttons = await screen.findAllByRole('button');

        expect(buttons).toHaveLength(6);
        await screen.findByText('Carolina Distance Learning');
        expect(screen.getAllByRole('link')).toHaveLength(21);
        await user.click(buttons[1]);
        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(7);
        await user.click(options[3]);
        expect(screen.getAllByRole('link')).toHaveLength(4);
    });
    it('filters by book', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const bookButton = await screen.findByRole('button', {name: 'Books'});

        await user.click(bookButton);
        const checkboxes = screen.getAllByRole('checkbox');

        expect(checkboxes).toHaveLength(24);
        await user.click(checkboxes[3]);
        await user.click(bookButton);
        expect(screen.getAllByRole('link')).toHaveLength(8);
        await user.click(checkboxes[3]);
        expect(checkboxes).toHaveLength(24);
    });
    it('filters by advanced filter', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const filterButton = await screen.findByRole('button', {
            name: 'Advanced Filters'
        });

        await user.click(filterButton);
        await user.click(screen.getByRole('button', {name: 'App Available'}));
        await user.click(screen.getByRole('checkbox', {name: 'App Available'}));
        await user.click(filterButton);
        expect(screen.getAllByRole('link')).toHaveLength(7);
        await user.click(filterButton);
        await user.click(screen.getByRole('button', {name: 'Cost'}));
        await user.click(screen.getByRole('checkbox', {name: '$11 - $25'}));
        await user.click(filterButton);
        expect(screen.getAllByRole('link')).toHaveLength(5);
    });
    it('sorts', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const sortButtons = await screen.findAllByRole('button', {
            name: 'Sort'
        });

        await user.click(sortButtons[0]);
        await user.click(screen.getByRole('option', {name: 'Name: A to Z'}));
        await user.click(sortButtons[0]);
        expect(
            screen
                .getAllByRole('link')
                .slice(-4)
                .map((obj) => obj.textContent)
        ).toEqual([
            'Rice Online Learning',
            'The Intro to Business GameSimulations$0-$10; $11-$25; $26-$40; >$40',
            'Top HatClicker/classroom engagement$0-$10; $26-$40',
            'Varsity Learning$0-$10'
        ]);
        await user.click(sortButtons[0]);
        await user.click(screen.getByRole('option', {name: 'Name: Z to A'}));
        await user.click(sortButtons[0]);
        expect(
            screen
                .getAllByRole('link')
                .slice(-4)
                .map((obj) => obj.textContent)
        ).toEqual([
            'Carolina Distance LearningLabs and Lab Manuals>$40',
            'Aktiv MathematicsOnline homework$11-$25; $26-$40',
            'Aktiv Chemistry (formerly Chem101)Online homework$11-$25; $26-$40',
            'Achieve Read & PracticeAdaptive Courseware$26-$40'
        ]);
        await user.click(sortButtons[0]);
        await user.click(screen.getByRole('option', {name: 'Name: Z to A'})); // Unsort
        await user.click(sortButtons[0]);
        expect(
            screen
                .getAllByRole('link')
                .slice(-4)
                .map((obj) => obj.textContent)
        ).not.toEqual([
            'Carolina Distance LearningLabs and Lab Manuals>$40',
            'Aktiv MathematicsOnline homework$11-$25; $26-$40',
            'Aktiv Chemistry (formerly Chem101)Online homework$11-$25; $26-$40',
            'Achieve Read & PracticeAdaptive Courseware$26-$40'
        ]);
    });
    it('shows details in dialog', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const partnerLink = await screen.findByRole('link', {name: 'Rice Online Learning'});

        await user.click(partnerLink);
        screen.getByRole('dialog');
        screen.getByText('through the edX platform', {exact: false});
        await user.click(screen.getByRole('button', {name: 'close'}));
    });
    it('displays sidebar of startups', async () => {
        /* eslint-disable camelcase */
        sfPartners[0].partnership_level = 'startup';
        sfPartners[1].partner_anniversary_date = '2020-03-04';
        sfPartners[2].partner_anniversary_date = '2020-03-04';
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const startupHeading = await screen.findByRole('heading', {level: 2, name: 'Startups'});

        expect(startupHeading.parentNode?.textContent).toContain(sfPartners[0].partner_name);
        sfPartners[0].partnership_level = 'Full partner';
        sfPartners[1].partner_anniversary_date = null;
        sfPartners[2].partner_anniversary_date = null;
        /* eslint-enable camelcase */
    });
    it('displays no sidebar when no other parterns are displayed', async () => {
        /* eslint-disable camelcase */
        sfPartners.map((p) => {p.partnership_level = 'startup';});
        sfPartners[0].partnership_level = 'Full partner';
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        await screen.findByRole('heading', {level: 2, name: 'Startups'});
        sfPartners.map((p) => p.partnership_level = 'Full partner'); // eslint-disable-line
        /* eslint-enable camelcase */
    });
});
