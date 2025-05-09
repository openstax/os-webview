import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import MoreFewer from '~/components/more-fewer/more-fewer';

const user = userEvent.setup();

describe('more-fewer', () => {
    function Component() {
        return (
            <MoreFewer pluralItemName='thing'>
                <div>one</div>
                <div>two</div>
                <div>three</div>
                <div>four</div>
                <div>five</div>
                <div>six</div>
                <div>seven</div>
                <div>eight</div>
                <div>nine</div>
                <div>ten</div>
                <div>eleven</div>
            </MoreFewer>
        );
    }
    it('toggles', async () => {
        window.scrollBy = jest.fn();
        render(<Component />);
        await user.click(screen.getByRole('button'));
        const olderButton = screen.getByRole('button', {name: 'Older'});

        await user.click(olderButton);
        expect(window.scrollBy).toHaveBeenCalled();
        screen.getByText('eleven');

        await (user.click(screen.getByRole('button', {name: 'Newer'})));
        screen.getByText('one');
    });
});
