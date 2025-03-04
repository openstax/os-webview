import React from 'react';
import {render, screen} from '@testing-library/preact';
import {FilteringSelect} from '~/components/form-elements/form-elements';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

describe('components/form-elements', () => {
    function Component() {
        const [accepted, accept] = React.useState<unknown>();
        const options = [
            {label: 'first', value: '1'},
            {label: 'second', value: '2'}
        ];

        return <FilteringSelect
        options={options}
        accept={accept}
        inputProps={{}}
        accepted={Boolean(accepted)}
        />;
    }
    it('handles keyboard input', async () => {
        render(<Component />);

        const b = screen.getByRole('textbox');

        await user.type(b, ' ');
        await user.type(b, 'se');
        const o = screen.getByRole('option', {name: 'first'});

        await user.click(o);
    });
});
