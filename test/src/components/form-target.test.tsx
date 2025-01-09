import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import useFormTarget from '~/components/form-target/form-target';

function Component() {
    const {onSubmit, submitting, FormTarget} = useFormTarget(() => null);

    return (
        <>
            <FormTarget />
            <button onClick={onSubmit}>MockSubmit</button>
            <div>{submitting ? 'submitting' : 'done'}</div>
        </>
    );
}

describe('form-target', () => {
    const user = userEvent.setup();

    it('controls the submitting cycle', async () => {
        render(<Component />);

        await user.click(screen.getByRole('button'));
        screen.findByText('submitting');
        document.getElementById('form-target')?.onload?.({} as Event);
        screen.findByText('done');
    });
});
