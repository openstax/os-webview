import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';

function Wrapped({disabled} : {disabled?: boolean}) {
    const [checked, setChecked] = React.useState(false);
    const props = {
        book: {
            value: 'book-value',
            text: 'book-text',
            coverUrl: 'book-url',
            subjects: [],
            comingSoon: false
        },
        name: 'cb-name',
        checked,
        toggle() {
            setChecked(!checked);
        },
        disabled
    };

    return (
        <BookCheckbox {...props} />
    );
}

function checkedOnes() {
    const cbs = screen.getAllByRole('checkbox');

    return Array.from(cbs).filter((b) => b.getAttribute('aria-checked') === 'true');
}

describe('book-checkbox', () => {
    const user = userEvent.setup();

    test('handles click', async () => {
        render(<Wrapped />);
        expect(checkedOnes()).toHaveLength(0);
        await user.click(screen.getByRole('checkbox'));
        expect(checkedOnes()).toHaveLength(1);
    });
    test('handles enter keypress', () => {
        render(<Wrapped />);
        expect(checkedOnes()).toHaveLength(0);
        screen.getByRole('checkbox').focus();
        fireEvent.keyDown(document.activeElement as Element, {
            key: 'Enter',
            preventDefault: () => 1
        });
        expect(checkedOnes()).toHaveLength(1);
    });
    test('handles disabled', async () => {
        render(<Wrapped disabled={true} />);
        const cb = screen.getByRole('checkbox');

        expect(cb.tabIndex).toBe(-1);
        await userEvent.click(cb);
        expect(checkedOnes()).toHaveLength(0);
    });
});
