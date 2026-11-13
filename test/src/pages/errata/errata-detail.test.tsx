import React from 'react';
import {render, screen} from '@testing-library/preact';
import ErrataDetailLoader from '~/pages/errata-detail/errata-detail';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import InPortal from '~/../../test/helpers/in-portal';
import ProgressBar from '~/pages/errata-detail/progress-bar/progress-bar';
import * as HE from '~/helpers/errata';
import * as DH from '~/helpers/use-document-head';

jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

function Component() {
    return (
        <MemoryRouter initialEntries={['/errata/7199']}>
            <ShellContextProvider>
                <ErrataDetailLoader />
            </ShellContextProvider>
        </MemoryRouter>
    );
}

describe('Errata Detail', () => {
    it('renders', async () => {
        render(<Component />);
        await screen.findByRole('heading', {
            level: 1,
            name: 'Errata Submission Details'
        });
        await screen.findByText('You can check', {exact: false});
    });
    it('renders in a portal, linking to the errata list in the portal', async () => {
        render(
            <MemoryRouter initialEntries={['/my-portal/errata/7199']}>
                <ShellContextProvider>
                    <InPortal portal="my-portal">
                        <ErrataDetailLoader />
                    </InPortal>
                </ShellContextProvider>
            </MemoryRouter>
        );
        await screen.findByText('You can check', {exact: false});
        expect(screen.getByRole('link', {name: /Errata Page/}).getAttribute('href'))
            .toMatch(/^\/my-portal\/errata\/\?book=/);
    });
    it('renders decision details', async () => {
        const spySSED = jest
            .spyOn(HE, 'shouldShowDecisionDetails')
            .mockReturnValueOnce(true);

        render(<Component />);
        await screen.findByText('You can check', {exact: false});
        const bb = document.querySelector('.body-block.graybottom');

        expect(bb?.textContent).toBe('Decision');
        spySSED.mockReset();
    });
    describe('progress bar', () => {
        it('represents reviewed', () => {
            render(<ProgressBar status="Reviewed" barStatus="" />);
            const bar = document.querySelectorAll('.progress-bar-layer')[1];

            expect(bar?.innerHTML).toBe(
                '<div class="node"></div><div class="node filled"></div><div class="node"></div>'
            );
        });
        it('represents will-correct', () => {
            render(<ProgressBar status="Will Correct" barStatus="" />);
            const bar = document.querySelectorAll('.progress-bar-layer')[1];

            expect(bar?.innerHTML).toBe(
                '<div class="node"></div><div class="node filled"></div><div class="node"></div>'
            );
        });
        it('represents corrected', () => {
            render(<ProgressBar status="anything" barStatus="Corrected" />);
            const bar = document.querySelectorAll('.progress-bar-layer')[1];

            expect(bar?.innerHTML).toBe(
                '<div class="node"></div><div class="node"></div><div class="node filled"></div>'
            );
        });
    });
});
