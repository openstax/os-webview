import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {SearchContextProvider} from '~/pages/partners/search-context';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import Partners from '~/pages/partners/partners';
import Results from '~/pages/partners/results/results';
import sfPartners from '../../data/salesforce-partners';
import * as MC from '~/contexts/main-class';
import * as DH from '~/helpers/use-document-head';
import * as UC from '~/contexts/user';
import * as LP from '~/components/jsx-helpers/loader-page';
import rawPageData from '~/../../test/src/data/partners';

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
/* eslint-disable camelcase */
jest.spyOn(UC, 'default').mockReturnValue({
    // @ts-expect-error incomplete type
    userModel: {
        id: 123,
        instructorEligible: false,
        accounts_id: 1
    },
    // @ts-expect-error incomplete type
    userStatus: {
        email: 'someone@rice.edu'
    }
});
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
            <MemoryRouter initialEntries={['/partners']}>
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

    function Component({
        initialEntries = ['/partners']
    }: Parameters<typeof MemoryRouter>[0]) {
        return (
            <ShellContextProvider>
                <MemoryRouter initialEntries={initialEntries}>
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
        expect(screen.getAllByRole('link')).toHaveLength(23);
        await user.click(buttons[1]);
        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(7);
        await user.click(options[3]);
        expect(screen.getAllByRole('link')).toHaveLength(6);
    });
    it('respects location.state.book', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(
            <Component
                initialEntries={[
                    {
                        pathname: '/partners',
                        state: {
                            book: ['Microbiology'],
                            confirmation: true,
                            slug: 'microbio'
                        }
                    }
                ]}
            />
        );
        await screen.findByText('Microbiology');
        await user.click(
            screen.getByRole('button', {name: 'close confirmation'})
        );
        expect(
            screen.queryByRole('button', {name: 'close confirmation'})
        ).toBeNull();
    });
    it('filters by book', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const bookButton = await screen.findByRole('button', {name: 'Books'});

        await user.click(bookButton);
        const checkboxes = screen.getAllByRole('checkbox');

        expect(screen.getAllByRole('link')).toHaveLength(23);
        expect(checkboxes).toHaveLength(48);
        await user.click(checkboxes[3]);
        expect(screen.getAllByRole('link')).toHaveLength(9);
        await user.click(bookButton);
        expect(screen.getAllByRole('link')).toHaveLength(9);
        await user.click(checkboxes[3]);
        expect(checkboxes).toHaveLength(48);
    });
    it('filters by advanced filter', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const filterButton = await screen.findByRole('button', {
            name: 'Advanced Filters'
        });

        await user.click(filterButton);
        await user.click(screen.getByRole('button', {name: 'App Available'}));
        await user.click(
            screen.getAllByRole('checkbox', {name: 'App Available'})[1]
        );
        await user.click(filterButton);
        expect(
            screen
                .getAllByRole('link')
                .filter((l) => l.classList.contains('partner-card'))
        ).toHaveLength(19);
        await user.click(filterButton);
        await user.click(screen.getByRole('button', {name: 'Cost'}));
        await user.click(screen.getByRole('checkbox', {name: '$11 - $25'}));
        await user.click(filterButton);
        expect(
            screen
                .getAllByRole('link')
                .filter((l) => l.classList.contains('partner-card'))
        ).toHaveLength(6);
        await user.click(filterButton);
        // The triangle pointer color matches the top item (code coverage)
        await user.click(screen.getByRole('button', {name: 'Adaptivity'}));
        await user.click(screen.getByRole('button', {name: 'Adaptivity'}));
        await user.click(filterButton);
        expect(
            screen
                .getAllByRole('link')
                .filter((l) => l.classList.contains('partner-card'))
        ).toHaveLength(6);
        // Filter remover
        await user.click(screen.getByRole('link', {name: 'Clear All'}));
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
        const partnerLink = await screen.findByRole('link', {
            name: 'Rice Online Learning'
        });

        await user.click(partnerLink);
        screen.getByRole('dialog');
        screen.getByText('through the edX platform', {exact: false});

        const infoButton = screen.getByRole('button', {name: 'Request Info!'});

        await user.click(infoButton);
        await user.click(screen.getByRole('button', {name: 'close'}));

        // partner with no landing page, and no books
        const saveWarn = console.warn;

        console.warn = jest.fn();
        await user.click(
            screen.getByRole('link', {name: 'FUVI Cognitive Intelligence'})
        );
        expect(console.warn).toHaveBeenCalledWith('Book not found:', '');
        console.warn = saveWarn;
    });
    it('displays startups section', async () => {
        /* eslint-disable camelcase */
        sfPartners[0].partnership_level = 'startup';
        sfPartners[1].partner_anniversary_date = '2020-03-04';
        sfPartners[2].partner_anniversary_date = '2020-03-04';
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const startupHeading = await screen.findByRole('heading', {
            level: 3,
            name: 'Startups as partners'
        });

        expect(startupHeading.parentNode?.textContent).toContain(
            sfPartners[0].partner_name
        );
        sfPartners[0].partnership_level = 'Full partner';
        sfPartners[1].partner_anniversary_date = null;
        sfPartners[2].partner_anniversary_date = null;
        /* eslint-enable camelcase */
    });
    it('toggles mobile controls', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        render(<Component />);
        const mobilebutton = await screen.findByRole('button', {
            name: 'Filters'
        });

        await user.click(mobilebutton);
        await user.click(
            (
                await screen.findAllByRole('button', {name: 'Advanced Filters'})
            )[0]
        );
        await user.click(
            (await screen.findAllByRole('button', {name: 'Adaptivity'}))[0]
        );

        const buttons = screen.getAllByRole('checkbox');
        const label = buttons[0].getAttribute('aria-label');

        await user.click(buttons[0]);
        await user.click(await screen.findByRole('button', {name: 'close'}));
        await screen.findByRole('button', {name: 'Filters (1)'});
        await user.click(screen.getByRole('button', {name: `remove filter for ${label}`}));
        expect(screen.queryByRole('button', {name: `remove filter for ${label}`})).toBeNull();
    });
    // This one has to be last; something doesn't reset
    it('uses default infoLinkText when none is provided', async () => {
        mockSfPartners.mockResolvedValue(sfPartners);
        const pageData = {...rawPageData, partner_request_info_link: ''}; // eslint-disable-line camelcase
        const mockLP = jest
            .spyOn(LP, 'default')
            .mockImplementationOnce(({Child}) => <Child data={pageData} />);

        render(<Component />);
        const partnerLink = await screen.findByRole('link', {
            name: 'Rice Online Learning'
        });

        await user.click(partnerLink);
        screen.getByRole('dialog');
        screen.getByText('through the edX platform', {exact: false});

        const infoButton = screen.getByRole('button', {name: 'Request info'}); // not "Request Info!"

        await user.click(infoButton);
        await user.click(screen.getByRole('button', {name: 'close'}));
        mockLP.mockReset();
    });
});
