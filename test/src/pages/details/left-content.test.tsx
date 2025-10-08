import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import {LanguageContextProvider} from '~/contexts/language';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import LeftContent from '~/pages/details/common/resource-box/left-content';

const mockUseUserContext = jest.fn();

jest.mock('~/contexts/user', () => ({
    ...jest.requireActual('~/contexts/user'),
    __esModule: true,
    default: () => mockUseUserContext()
}));

describe('left-content', () => {
    type ModelType = Parameters<typeof LeftContent>[0]['model'];
    const baseModel = {
        comingSoon: false,
        iconType: 'lock',
        heading: 'heading',
        double: false
    } as unknown as ModelType; // incomplete, but it's enough for testing
    const link = {url: '#good-url', text: 'button-label'};
    // Setup option prevents await click from hanging when using faketimers
    const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

    function Component({
        model,
        search = 'Instructor'
    }: {
        model: ModelType;
        search?: string;
    }) {
        return (
            <MemoryRouter initialEntries={[`/resource?${search}`]}>
                <LanguageContextProvider>
                    <LeftContent model={model} />
                </LanguageContextProvider>
            </MemoryRouter>
        );
    }

    mockUseUserContext.mockReturnValue({
        userStatus: {
            isInstructor: false
        }
    });

    it('returns Access Pending if no link is provided', () => {
        render(<Component model={baseModel} />);
        screen.findByText('Access Pending');
    });
    it('returns MISSING LINK if link has no URL', () => {
        jest.useFakeTimers();
        const model = {link: {text: 'whoops', url: ''}, ...baseModel};

        render(<Component model={model} />);
        jest.runAllTimers();
        screen.findByText('MISSING LINK');
    });
    it('returns a lock icon/no button if icon is lock and use is not an instructor', () => {
        const model = {link, ...baseModel};

        render(<Component model={model} />);
        screen.findByText('Only available', {exact: false});
    });
    it('returns a link if user is instructor', () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: true
            }
        });
        const model = {link, ...baseModel, ...{iconType: 'unlock'}};

        render(<Component model={model} search="Student" />);
        const foundLink = screen.getByRole('link');

        expect(foundLink.textContent).toBe('button-label');
    });
    it('clicking download link opens dialog', async () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: true
            }
        });
        const model = {link, ...baseModel, iconType: 'download'};

        render(<Component model={model} />);
        const foundLink = screen.getByRole('link');

        expect(foundLink.textContent).toBe('button-label');
        await user.click(foundLink);
        await screen.findByText('Give today');
        const downloadLink = await screen.findByText('Go to your resource');

        await user.click(downloadLink);
    });
    it("Doesn't track downloads if not instructor", async () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: false
            }
        });
        const model = {link, ...baseModel, iconType: 'download'};

        render(<Component model={model} search="Student" />);
        const foundLink = screen.getByRole('link');

        expect(foundLink.textContent).toBe('button-label');
        await user.click(foundLink);
        await screen.findByText('Give today');
        const downloadLink = await screen.findByText('Go to your resource');

        await user.click(downloadLink);
    });
    it('handles unknown search', async () => {
        mockUseUserContext.mockReturnValue({
            userStatus: {
                isInstructor: false
            }
        });
        const model = {link, ...baseModel, iconType: 'download'};

        render(<Component model={model} search="" />);
        const foundLink = screen.getByRole('link');

        expect(foundLink.textContent).toBe('button-label');
        await user.click(foundLink);
        await screen.findByText('Give today');
        const downloadLink = await screen.findByText('Go to your resource');

        await user.click(downloadLink);
    });
    it('handles unknown icon and unknown search', async () => {
        const model = {link, ...baseModel, iconType: 'unknown-icon'};

        render(<Component model={model} search="unknown" />);
        const foundLink = screen.getByRole('link');

        expect(foundLink.textContent).toBe('button-label');
        await user.click(foundLink);
    });
});
