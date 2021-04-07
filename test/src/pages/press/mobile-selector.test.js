import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import MobileSelector from '~/pages/press/mobile-selector/mobile-selector';

test('opens, changes values, and closes', () => {
    let mobileSelection = 'Press releases';
    const values = [
        'Press releases',
        'News mentions',
        'Press inquiries',
        'Booking'
    ];
    const props = {
        selectedValue: mobileSelection,
        values,
        onChange(newValue) {
            mobileSelection = newValue;
        }
    };

    render(<MobileSelector {...props} />);
    expect(screen.queryByRole('menuitem')).toBeNull();

    const selectorButton = screen.getByRole('button');

    userEvent.click(selectorButton);
    expect(screen.queryAllByRole('menuitem')).toHaveLength(values.length);
    userEvent.click(screen.getByText(values[1]));
    expect(mobileSelection).toBe(values[1]);
    expect(screen.queryByRole('menuitem')).toBeNull();
});
