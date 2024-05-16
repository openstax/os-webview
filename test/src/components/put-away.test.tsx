import React from 'react';
import {describe, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import PutAway from '~/components/put-away/put-away';
import userEvent from '@testing-library/user-event';

describe('put-away', () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    it('renders and does onClose when clicked', async () => {
        render(<PutAway onClick={onClose} />);
        await user.click(screen.getByRole('button'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
    it('does onClose when sent Escape but not a', async () => {
        render(<PutAway onClick={onClose} ariaLabel="keyboard-test" />);
        const b = screen.getByRole('button');

        b.focus();
        await user.keyboard('{Enter}');
        expect(onClose).toHaveBeenCalledTimes(2);
        await user.keyboard('{a}');
        expect(onClose).toHaveBeenCalledTimes(2);
    });
});
