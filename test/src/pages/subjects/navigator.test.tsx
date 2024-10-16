import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render} from '@testing-library/preact';
import Navigator from '~/pages/subjects/new/specific/navigator';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import {SpecificSubjectContextProvider} from '~/pages/subjects/new/specific/context';
import businessBooksData from '~/../../test/src/data/business-books';
import {MemoryRouter} from 'react-router-dom';
import {NavigatorContextProvider} from '~/pages/subjects/new/specific/navigator-context';

const mockUsePageData = jest.fn();

jest.mock('~/helpers/use-page-data', () => ({
    __esModule: true,
    default: () => mockUsePageData()
}));

mockUsePageData.mockReturnValue(businessBooksData);
const subject = {
    value: 'business',
    cms: 'business',
    html: 'Business',
    title: 'business',
    icon: '?',
    color: '?'
};

function Component() {
    return (
        <ShellContextProvider>
            <MemoryRouter
                basename="/subjects"
                initialEntries={['/subjects/business']}
            >
                <SpecificSubjectContextProvider contextValueParameters="business">
                    <NavigatorContextProvider>
                        <Navigator subject={subject} />
                    </NavigatorContextProvider>
                </SpecificSubjectContextProvider>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

describe('subjects/navigator-context', () => {
    jest.spyOn(console, 'info').mockImplementation(() => null);

    it('handles clicks for links whose target is not there', async () => {
        render(<Component />);

        expect(console.info).toHaveBeenCalledWith('Did not find', 'Accounting');
    });
});
