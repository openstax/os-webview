import React from 'react';
import {render, screen} from '@testing-library/preact';
import AuthorsSection from '~/pages/details/common/authors';
import * as DC from '~/pages/details/context';
import ShellContextProvider from '../../../../helpers/shell-context';
import $ from '~/helpers/$';

const spyDetailsContext = jest.spyOn(DC, 'default');

function Component() {
    return (
        <ShellContextProvider>
            <AuthorsSection />
        </ShellContextProvider>
    );
}

// Just a couple edge cases other tests don't cover
describe('details/common/authors', () => {
    it('renders empty author list', () => {
        spyDetailsContext.mockReturnValue({
            title: 'title',
            authors: []
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(<Component />);
        // Not a very good test; nothing changes
        expect(document.body.textContent).toBe('');
    });
    it('uses Polish headings', async () => {
        spyDetailsContext.mockReturnValue({
            title: 'title',
            authors: [
                {
                    name: 'The Author',
                    university: 'Where',
                    seniorAuthor: true
                }
            ]
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        jest.spyOn($, 'isPolish').mockReturnValue(true);
        render(<Component />);
        await screen.findByText('Główni autorzy');
    });
});
