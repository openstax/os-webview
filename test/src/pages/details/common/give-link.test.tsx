import React from 'react';
import {render, screen} from '@testing-library/preact';
import {GiveLink} from '~/pages/details/common/common';
import ShellContextProvider from '../../../../helpers/shell-context';

jest.mock('~/models/give-today', () => () => ({
    showLink: true,
    give_link: 'the link', // eslint-disable-line camelcase
    give_link_text: 'the text' // eslint-disable-line camelcase
}));

describe('details/common', () => {
    it('renders GiveLink', async () => {
        render(
            <ShellContextProvider>
                <GiveLink />
            </ShellContextProvider>
        );
        await screen.findByText('the text');
    });
});
