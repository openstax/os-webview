import React from 'react';
import {render, screen} from '@testing-library/preact';
import FormCheckboxgroup from '~/components/form-checkboxgroup/form-checkboxgroup';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('components/form-checkboxgroup', () => {
    it('shows label, longLabel, instructions if given', async () => {
        const options = [
            {label: 'optlabel 1', value: 'optvalue 1'},
            {label: 'optlabel 2', value: ''}
        ];
        const onChange = jest.fn();

        render(<FormCheckboxgroup
            name='test 1'
            label='label 1'
            longLabel='long label 1'
            instructions='instructions 1'
            options={options}
            onChange={onChange}
            />);
        screen.getByText('label 1');
        screen.getByText('long label 1');
        screen.getByText('instructions 1');

        const cbs = screen.getAllByRole('checkbox');

        await user.click(cbs[0]);
        expect(onChange).toHaveBeenCalled();
        await user.click(cbs[0]);
    });
});
