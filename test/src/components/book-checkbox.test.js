import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import BookCheckbox from '~/components/book-checkbox/book-checkbox';

let checked = false;
const props = {
    book: {
        value: 'book-value',
        text: 'book-text',
        coverUrl: 'book-url'
    },
    name: 'cb-name',
    checked,
    toggle() {
        checked = !checked;
    }
};

function Wrapped() {
    const [checked, setChecked] = React.useState(false);
    const props = {
        book: {
            value: 'book-value',
            text: 'book-text',
            coverUrl: 'book-url'
        },
        name: 'cb-name',
        checked,
        toggle() {
            setChecked(!checked);
        }
    };

    return (
        <BookCheckbox {...props} />
    )
}

function checkedOnes() {
    const cbs = screen.getAllByRole('checkbox');

    return Array.from(cbs).filter((b) => b.getAttribute('aria-checked') === 'true');
}

test('handles click', () => {
    render(<Wrapped />);
    expect(checkedOnes()).toHaveLength(0);
    userEvent.click(screen.queryByRole('checkbox'));
    expect(checkedOnes()).toHaveLength(1);
});
test('handles enter keypress', () => {
    render(<Wrapped />);
    expect(checkedOnes()).toHaveLength(0);
    screen.queryByRole('checkbox').focus();
    fireEvent.keyDown(document.activeElement, {
        key: 'Enter',
        preventDefault: () => 1
    });
    expect(checkedOnes()).toHaveLength(1);
});
