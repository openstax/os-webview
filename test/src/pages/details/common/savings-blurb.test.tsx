import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import SavingsBlurb from '~/pages/details/common/savings-blurb';
import * as DC from '~/pages/details/context';
import * as SFF from '~/models/sfapi';

const spyDetailsContext = jest.spyOn(DC, 'default');
const spySfApiFetch = jest.spyOn(SFF, 'default');
const supportStatement = `With philanthropic support, this book is used
    in <span id='adoption_number'></span> classrooms,
    saving students <span id='savings'></span> dollars this school year.`;

function mockContext(overrides = {}) {
    spyDetailsContext.mockReturnValue({
        supportStatement,
        salesforceName: 'American Government',
        ...overrides
    } as unknown as ReturnType<typeof DC.default>);
}

describe('details/common/savings-blurb', () => {
    beforeEach(() => {
        spySfApiFetch.mockReset();
        mockContext();
    });

    it('plugs sfapi numbers into the template', async () => {
        spySfApiFetch.mockResolvedValue({
            books: [{adoptions: 4983, savings: 8751837.4}]
        });
        render(<SavingsBlurb />);
        await screen.findByText('philanthropic support', {exact: false});
        screen.getByText('4,983');
        screen.getByText('8,751,837');
        expect(spySfApiFetch).toHaveBeenCalledWith(
            'impact',
            '/books?name=American%20Government'
        );
    });
    it('skips adoption if there is no span for it', async () => {
        mockContext({
            supportStatement: `With philanthropic support, this book is used
            in bunches of classrooms,
            saving students <span id='savings'></span> dollars.`
        });
        spySfApiFetch.mockResolvedValue({
            books: [{adoptions: 1000, savings: 69420}]
        });
        render(<SavingsBlurb />);
        await screen.findByText('69,420');
        expect(screen.queryByText('1,000')).toBeNull();
    });
    it('renders nothing when books is empty', async () => {
        spySfApiFetch.mockResolvedValue({books: []});
        const {container} = render(<SavingsBlurb />);

        await waitFor(() => expect(spySfApiFetch).toHaveBeenCalled());
        expect(container.querySelector('.savings-blurb')).toBeNull();
    });
    it('renders nothing when the response has no books key (404 body)', async () => {
        spySfApiFetch.mockResolvedValue({detail: 'Not found'});
        const {container} = render(<SavingsBlurb />);

        await waitFor(() => expect(spySfApiFetch).toHaveBeenCalled());
        expect(container.querySelector('.savings-blurb')).toBeNull();
    });
    it('renders nothing when the fetch fails', async () => {
        spySfApiFetch.mockResolvedValue(null);
        const {container} = render(<SavingsBlurb />);

        await waitFor(() => expect(spySfApiFetch).toHaveBeenCalled());
        expect(container.querySelector('.savings-blurb')).toBeNull();
    });
    it('does not fetch without a salesforce name', async () => {
        mockContext({salesforceName: undefined});
        const {container} = render(<SavingsBlurb />);

        await Promise.resolve();
        expect(spySfApiFetch).not.toHaveBeenCalled();
        expect(container.querySelector('.savings-blurb')).toBeNull();
    });
});
