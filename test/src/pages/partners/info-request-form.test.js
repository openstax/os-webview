import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import useSalesforceContext, {SalesforceContextProvider} from '~/contexts/salesforce';
import useSearchContext from '~/pages/partners/search-context';
import userEvent from '@testing-library/user-event';
import InfoRequestForm from '../../../../src/app/pages/partners/partner-details/info-request-form/info-request-form';
import {MemoryRouter} from 'react-router-dom';
import {MainClassContextProvider} from '~/contexts/main-class';
import { SearchContextProvider } from '../../../../src/app/pages/partners/search-context';

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

test(
    'Form renders',
    async () => {
        const texts = screen.getAllByText(/\?/);

        expect(texts).toHaveLength(1);

        const labels = screen.getAllByText(/Book/);

        expect(labels).toHaveLength(1);
    }
);
