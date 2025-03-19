import React from 'react';
import {render, screen, fireEvent} from '@testing-library/preact';
import FormRadioGroup from '~/components/form-radiogroup/form-radiogroup';
import userEvent from '@testing-library/user-event';

const adoptionYesNoOptions = [
    {label: 'Yes', value: 'y'},
    {label: 'No', value: 'n'}
];

describe('components/form-radiogroup', () => {
    const user = userEvent.setup();

    it('displays validation message when required until selected', async () => {
        render(
            <FormRadioGroup
                name="test1"
                options={adoptionYesNoOptions}
                required={true}
            />
        );
        const options = screen.getAllByRole('radio');

        expect(document.querySelector('.invalid-message')?.textContent).toBe(
            'Constraints not satisfied'
        );

        expect(options).toHaveLength(2);
        await user.click(options[1]);
        expect(document.querySelector('.invalid-message')?.textContent).toBe(
            ''
        );
    });
    it('displays with optional longLabel', () => {
        render(
            <FormRadioGroup
                name="test1"
                options={adoptionYesNoOptions}
                longLabel="This is your instruction"
            />
        );
        screen.getByText('This is your instruction');
    });
});
