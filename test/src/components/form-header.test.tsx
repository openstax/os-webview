/* eslint-disable camelcase */
import React from 'react';
import {describe, expect, it, beforeEach} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import FormHeader from '~/components/form-header/form-header';
import MemoryRouter from '../../helpers/future-memory-router';
import {LanguageContextProvider} from '~/contexts/language';
import {UserContextProvider} from '~/contexts/user';
import * as UM from '~/models/usermodel';
import userModel from '../data/userModel';
import usePageData from '~/helpers/use-page-data';

jest.mock('~/helpers/use-page-data');

const baseData = {
    adoption_intro_heading: 'Default heading',
    adoption_intro_description: '<p>Default description</p>'
};

function Component() {
    return (
        <MemoryRouter initialEntries={['/adoption']}>
            <LanguageContextProvider>
                <UserContextProvider>
                    <FormHeader prefix="adoption" />
                </UserContextProvider>
            </LanguageContextProvider>
        </MemoryRouter>
    );
}

describe('FormHeader', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('renders default heading when user is not logged in', () => {
        (usePageData as jest.Mock).mockReturnValue({
            ...baseData,
            adoption_logged_in_intro_heading: 'Hi {{first_name}}',
            adoption_logged_in_intro_description: '<p>Welcome back</p>'
        });
        render(<Component />);
        expect(screen.getByText('Default heading')).toBeTruthy();
        expect(screen.queryByText(/Hi/)).toBeNull();
    });

    it('renders logged-in heading when user is logged in and field present', () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
        (usePageData as jest.Mock).mockReturnValue({
            ...baseData,
            adoption_logged_in_intro_heading: 'Hi {{first_name}}',
            adoption_logged_in_intro_description: '<p>Welcome back {{first_name}}</p>'
        });
        render(<Component />);
        expect(screen.getByText('Hi Roy')).toBeTruthy();
        expect(screen.getByText(/Welcome back Roy/)).toBeTruthy();
    });

    it('falls back to default when logged-in fields are blank', () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
        (usePageData as jest.Mock).mockReturnValue({
            ...baseData,
            adoption_logged_in_intro_heading: '',
            adoption_logged_in_intro_description: ''
        });
        render(<Component />);
        expect(screen.getByText('Default heading')).toBeTruthy();
    });

    it('substitutes school and last_name tags', () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
        (usePageData as jest.Mock).mockReturnValue({
            ...baseData,
            adoption_logged_in_intro_heading: '{{last_name}} at {{school}}'
        });
        render(<Component />);
        expect(screen.getByText('Johnson at Test University')).toBeTruthy();
    });

    it('replaces unknown tags with empty string', () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
        (usePageData as jest.Mock).mockReturnValue({
            ...baseData,
            adoption_logged_in_intro_heading: 'Hello {{nonexistent}}there'
        });
        render(<Component />);
        expect(screen.getByText('Hello there')).toBeTruthy();
    });

    it('falls back to empty string when all fields are missing (line 23)', () => {
        jest.spyOn(UM, 'useUserModel').mockReturnValue(
            userModel as unknown as UM.UserModelType
        );
        // Don't provide any heading fields to test the empty string fallback
        (usePageData as jest.Mock).mockReturnValue({});
        render(<Component />);
        // When no fields are provided, the component should render with empty heading
        // This tests line 23: return override || data[`${prefix}${suffix}`] || '';
        const heading = document.querySelector('h1');

        expect(heading?.textContent).toBe('');
    });
});
