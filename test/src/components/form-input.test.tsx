import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import FormInput from '~/components/form-input/form-input';
import userEvent from '@testing-library/user-event';

jest.mock('~/helpers/main-class-hooks');

describe('components/form-input', () => {
    const user = userEvent.setup();

    it('handles various key-downs', async () => {
        render(
            <FormInput
                label="label"
                inputProps={{}}
                longLabel="this is a long label"
            />
        );
        const input = screen.getByRole('textbox');

        fireEvent.keyDown(input, {key: ' '});
        fireEvent.keyDown(input, {key: 'Escape'});
        input.focus();
        await user.keyboard('Rice');
    });
    it('handles selection of suggestion', () => {
        const onChange = jest.fn();

        render(
            <FormInput
                label="label"
                inputProps={{value: 'on', onChange}}
                suggestions={['one', 'two', 'three']}
            />
        );
        const input = screen.getByRole('textbox');

        fireEvent.keyDown(input, {key: 'ArrowDown'});
        fireEvent.keyDown(input, {key: 'Enter'});
    });
    it('handles over-long list of suggestions', async () => {
        const suggestions = [];

        for (let i=0; i < 420; ++i) {
            suggestions[i] = `item ${i}`;
        }
        render(
            <FormInput
                label="label"
                inputProps={{value: 'item'}}
                suggestions={suggestions}
            />
        );
        const suggestion = screen.getByText('item 20');

        // Mouse-interacts with suggestion items
        fireEvent.mouseMove(suggestion);
        await user.click(suggestion);
    });
});
