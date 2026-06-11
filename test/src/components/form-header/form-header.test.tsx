import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import FormHeaderLoader from '~/components/form-header/form-header';
import ShellContextProvider from '../../../helpers/shell-context';
import * as userContext from '~/contexts/user';
import * as pageData from '~/helpers/page-data-utils';

const mockData = {
    testIntroHeading: 'Default Heading',
    testIntroDescription: 'Default description',
    testLoggedInIntroHeading: 'Logged In Heading',
    testLoggedInIntroDescription: 'Logged in description for {{first_name}} {{last_name}} at {{school}}'
};

function Wrapper({children}: {children: React.ReactNode}) {
    return <ShellContextProvider>{children}</ShellContextProvider>;
}

describe('FormHeader', () => {
    beforeEach(() => {
        jest.spyOn(pageData, 'useDataFromSlug').mockReturnValue(mockData);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders default heading and description when not logged in', async () => {
        jest.spyOn(userContext, 'default').mockReturnValue({
            userStatus: undefined,
            isLoggedIn: false
        } as any);

        render(
            <Wrapper>
                <FormHeaderLoader prefix="test" />
            </Wrapper>
        );

        await screen.findByText('Default Heading');
        expect(screen.getByText('Default description')).toBeInTheDocument();
    });

    it('renders logged in heading and description when logged in', async () => {
        jest.spyOn(userContext, 'default').mockReturnValue({
            userStatus: {
                firstName: 'John',
                lastName: 'Doe',
                school: 'Test University'
            },
            isLoggedIn: true
        } as any);

        render(
            <Wrapper>
                <FormHeaderLoader prefix="test" />
            </Wrapper>
        );

        await screen.findByText('Logged In Heading');
        expect(
            screen.getByText('Logged in description for John Doe at Test University')
        ).toBeInTheDocument();
    });

    it('falls back to default when logged in override is empty', async () => {
        jest.spyOn(userContext, 'default').mockReturnValue({
            userStatus: {
                firstName: 'Jane',
                lastName: 'Smith',
                school: ''
            },
            isLoggedIn: true
        } as any);

        jest.spyOn(pageData, 'useDataFromSlug').mockReturnValue({
            testIntroHeading: 'Default Heading',
            testIntroDescription: 'Default description',
            testLoggedInIntroHeading: '',
            testLoggedInIntroDescription: ''
        });

        render(
            <Wrapper>
                <FormHeaderLoader prefix="test" />
            </Wrapper>
        );

        await screen.findByText('Default Heading');
        expect(screen.getByText('Default description')).toBeInTheDocument();
    });

    it('interpolates user data in templates', async () => {
        jest.spyOn(userContext, 'default').mockReturnValue({
            userStatus: {
                firstName: 'Alice',
                lastName: 'Johnson',
                school: 'MIT'
            },
            isLoggedIn: false
        } as any);

        jest.spyOn(pageData, 'useDataFromSlug').mockReturnValue({
            testIntroHeading: 'Welcome {{first_name}}',
            testIntroDescription: 'From {{school}}'
        });

        render(
            <Wrapper>
                <FormHeaderLoader prefix="test" />
            </Wrapper>
        );

        await screen.findByText('Welcome Alice');
        expect(screen.getByText('From MIT')).toBeInTheDocument();
    });

    it('handles missing user data gracefully', async () => {
        jest.spyOn(userContext, 'default').mockReturnValue({
            userStatus: undefined,
            isLoggedIn: true
        } as any);

        jest.spyOn(pageData, 'useDataFromSlug').mockReturnValue({
            testLoggedInIntroHeading: 'Hello {{first_name}}',
            testLoggedInIntroDescription: 'Welcome'
        });

        render(
            <Wrapper>
                <FormHeaderLoader prefix="test" />
            </Wrapper>
        );

        await screen.findByText('Hello ');
        expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
});
