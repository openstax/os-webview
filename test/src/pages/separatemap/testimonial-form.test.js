import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import TestimonialForm from '~/pages/separatemap/testimonial-form/testimonial-form';
import {SalesforceContextProvider} from '~/contexts/salesforce';

const props = {
    email: 'e@mail.com',
    school: 'info.self_reported_school',
    firstName: 'Firstly',
    lastName: 'Namester',
    afterSubmit() {
        console.log('Aftersubmit fired');
    }
};

test('initially hides textarea and submit', (done) => {
    render(<SalesforceContextProvider><TestimonialForm {...props} /></SalesforceContextProvider>);

    setTimeout(() => {
        expect(screen.queryAllByRole('textbox')).toHaveLength(0);
        expect(screen.queryAllByRole('submit')).toHaveLength(0);
        userEvent.click(screen.getByRole('listbox'));
        // At this point, there should be textbox and submit, but they
        // are not showing up in the test. :(
        done();
    }, 0);
});
