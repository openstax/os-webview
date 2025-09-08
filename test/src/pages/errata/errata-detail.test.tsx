import React from 'react';
import {render, screen} from '@testing-library/preact';
import ErrataDetailLoader from '~/pages/errata-detail/errata-detail';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import ProgressBar from '~/pages/errata-detail/progress-bar/progress-bar';
import * as HE from '~/helpers/errata';
import * as DH from '~/helpers/use-document-head';

jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

describe('Errata Detail', () => {
    it('renders', async () => {
        render(
            <MemoryRouter initialEntries={['/errata/7199']} >
                <ErrataDetailLoader />
            </MemoryRouter>
        );
        await screen.findByRole('heading', {level: 1, name: 'Errata Submission Details'});
        await screen.findByText('You can check', {exact: false});
    });
    it('renders decision details', async () => {
        const spySSED = jest.spyOn(HE, 'shouldShowDecisionDetails').mockReturnValueOnce(true);

        render(
            <MemoryRouter initialEntries={['/errata/7199']} >
                <ErrataDetailLoader />
            </MemoryRouter>
        );
        await screen.findByText('You can check', {exact: false});
        const bb = document.querySelector('.body-block.graybottom');

        expect(bb?.textContent).toBe('Decision');
        spySSED.mockReset();
    });
    describe('progress bar', () => {
        it('represents reviewed', () => {
            render(<ProgressBar status='Reviewed' barStatus='' />);
            const bar = document.querySelectorAll('.progress-bar-layer')[1];

            expect(bar?.innerHTML).toBe(
                '<div class="node"></div><div class="node filled"></div><div class="node"></div>'
            );
        });
        it('represents will-correct', () => {
            render(<ProgressBar status='Will Correct' barStatus='' />);
            const bar = document.querySelectorAll('.progress-bar-layer')[1];

            expect(bar?.innerHTML).toBe(
                '<div class="node"></div><div class="node filled"></div><div class="node"></div>'
            );
        });
        it('represents corrected', () => {
            render(<ProgressBar status='anything' barStatus='Corrected' />);
            const bar = document.querySelectorAll('.progress-bar-layer')[1];

            expect(bar?.innerHTML).toBe(
                '<div class="node"></div><div class="node"></div><div class="node filled"></div>'
            );
        });
    });
});

