import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import ContactInfo from '~/components/contact-info/contact-info';

const validatorRef = {}
const props = {validatorRef};

it('creates', () => {
    render(<ContactInfo {...props} />);
    expect(validatorRef).toHaveProperty('current');
});
it('validates schools', () => {
    render(<ContactInfo {...props} />);

    const inputs = screen.getAllByRole('textbox');
    const schoolInput = inputs.find((i) => i.name === 'company');

    userEvent.type(schoolInput, 'Rice');
    // Fire the validator function
    expect(validatorRef.current()).toBe(false);
});
