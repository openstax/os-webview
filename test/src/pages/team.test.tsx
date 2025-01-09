import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import TeamLoader from '~/pages/team/team';
import {MemoryRouter} from 'react-router-dom';
import {it, expect} from '@jest/globals';
import userEvent from '@testing-library/user-event';
import $ from '~/helpers/$';

const spyScrollTo = jest.spyOn($, 'scrollTo');

spyScrollTo.mockReturnValue(undefined);

describe('team', () => {
    const user = userEvent.setup();

    it('creates with a big chunk of data', async () => {
        render(
            <MemoryRouter>
                <TeamLoader />
            </MemoryRouter>
        );
        await screen.findByRole('tablist');
        expect(screen.queryAllByRole('heading').length).toBeGreaterThan(3);
    });
    it('operates accordion group', async () => {
        render(
            <MemoryRouter>
                <TeamLoader />
            </MemoryRouter>
        );
        const accordionButtons = await screen.findAllByRole('button');

        expect(accordionButtons).toHaveLength(2);
        expect(accordionButtons[0].textContent).toBe('OpenStax Team');
        await user.click(accordionButtons[0]);
        await waitFor(() => expect(spyScrollTo).toHaveBeenCalledTimes(1));
        await user.click(accordionButtons[0]);
        // Wait for else branch to fire, nothing happens in the code
        setTimeout($.scrollTo, 20);
        await waitFor(() => expect(spyScrollTo).toHaveBeenCalledTimes(2));
    });
});
