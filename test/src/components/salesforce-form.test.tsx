import React from 'react';
import {fireEvent, render, screen} from '@testing-library/preact';
import SalesforceForm from '~/components/salesforce-form/salesforce-form';
import * as SFC from '~/contexts/salesforce';
import userEvent from '@testing-library/user-event';

const {SalesforceContextProvider} = SFC;
const afterSubmit = jest.fn();

function Component() {
    return (<SalesforceForm postTo='foo' afterSubmit={afterSubmit}>
            <input type="submit" />
        </SalesforceForm>);
}

describe('salesforce-form', () => {
    it('shows loading until oid is populated', () => {
        render(<Component />);
        screen.getByText('Loading...');
    });
    it('shows form, submits', async () => {
        jest.spyOn(SFC, 'default').mockReturnValue({
            debug: true,
            oid: 'something'
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        render(<SalesforceContextProvider>
            <Component />
        </SalesforceContextProvider>);
        // Can't actually submit in jest
        screen.getByRole('form').onsubmit = (e) => {
            e.preventDefault();
        };
        await userEvent.click(screen.getByRole('button'));
        const iframe = document.querySelector('iframe') as HTMLIFrameElement;

        fireEvent.load(iframe);
        expect(afterSubmit).toHaveBeenCalled();
    });
});
