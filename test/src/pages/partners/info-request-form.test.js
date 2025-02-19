import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {SalesforceContextProvider} from '~/contexts/salesforce';
import * as PC from '~/pages/partners/partner-details/partner-context';
import InfoRequestForm from '~/pages/partners/partner-details/info-request-form/info-request-form';
import {MainClassContextProvider} from '~/contexts/main-class';
import { SearchContextProvider } from '~/pages/partners/search-context';

beforeEach(
    async () => {
        render(
            <ShellContextProvider>
                <SearchContextProvider>
                    <SalesforceContextProvider>
                        <MainClassContextProvider>
                            <InfoRequestForm />
                        </MainClassContextProvider>
                    </SalesforceContextProvider>
                </SearchContextProvider>
            </ShellContextProvider>
        );
        await screen.findByText(/Next/);
    }
);

jest.spyOn(PC, 'default').mockReturnValue({
    partnerName: 'Test',
    books: []
});

test(
    'Form renders',
    async () => {
        const texts = screen.getAllByText(/\?/);

        expect(texts).toHaveLength(1);

        const labels = screen.getAllByText(/Book/);

        expect(labels).toHaveLength(1);
    }
);
