import React from 'react';
import {render, screen} from '@testing-library/preact';
import '@testing-library/jest-dom';
import {IntlProvider} from 'react-intl';
import ThankYou from '~/pages/details/common/get-this-title-files/give-before-pdf/thank-you-form';
import * as UserContext from '~/contexts/user';

// Mock SchoolSelector to avoid needing LanguageContext and MainClassContext
jest.mock('~/components/school-selector/school-selector', () => {
    return function MockSchoolSelector() {
        return <div data-testid="mock-school-selector" />;
    };
});

function Wrapper({children}: {children: React.ReactNode}) {
    return (
        <IntlProvider locale="en" messages={{}}>
            {children}
        </IntlProvider>
    );
}

describe('ThankYou', () => {
    const defaultProps = {
        link: 'https://example.com/pdf',
        close: jest.fn(),
        source: 'test-source'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the thank you form without accountUuid', () => {
        jest.spyOn(UserContext, 'default').mockReturnValue({
            userModel: {
                first_name: 'John',
                last_name: 'Doe',
                self_reported_school: 'Test University',
                uuid: undefined // No UUID
            }
        } as ReturnType<typeof UserContext.default>);

        const {container} = render(
            <Wrapper>
                <ThankYou {...defaultProps} />
            </Wrapper>
        );

        // Verify form renders
        expect(screen.getByRole('button', {name: /Submit note and go to PDF/i})).toBeInTheDocument();

        // Verify the account_uuid hidden input is NOT present
        const accountUuidInput = container.querySelector('input[name="account_uuid"]');
        expect(accountUuidInput).toBeNull();
    });

    it('renders the thank you form with accountUuid when user has uuid (line 97)', () => {
        const testUuid = '12345-67890-abcdef';

        jest.spyOn(UserContext, 'default').mockReturnValue({
            userModel: {
                first_name: 'Jane',
                last_name: 'Smith',
                self_reported_school: 'Example College',
                uuid: testUuid // User has UUID
            }
        } as ReturnType<typeof UserContext.default>);

        const {container} = render(
            <Wrapper>
                <ThankYou {...defaultProps} />
            </Wrapper>
        );

        // Verify form renders
        expect(screen.getByRole('button', {name: /Submit note and go to PDF/i})).toBeInTheDocument();

        // Verify the account_uuid hidden input IS present with correct value (line 97)
        const accountUuidInput = container.querySelector('input[name="account_uuid"]') as HTMLInputElement;
        expect(accountUuidInput).toBeInTheDocument();
        expect(accountUuidInput.value).toBe(testUuid);
        expect(accountUuidInput.type).toBe('hidden');
    });

    it('renders with custom itemType', () => {
        jest.spyOn(UserContext, 'default').mockReturnValue({
            userModel: {
                first_name: 'Test',
                last_name: 'User'
            }
        } as ReturnType<typeof UserContext.default>);

        render(
            <Wrapper>
                <ThankYou {...defaultProps} itemType="eBook" />
            </Wrapper>
        );

        expect(screen.getByRole('button', {name: /Submit note and go to eBook/i})).toBeInTheDocument();
        expect(screen.getByText(/Never mind, just go to the eBook/i)).toBeInTheDocument();
    });

    it('populates form fields with user data', () => {
        jest.spyOn(UserContext, 'default').mockReturnValue({
            userModel: {
                first_name: 'Alice',
                last_name: 'Johnson',
                self_reported_school: 'State University'
            }
        } as ReturnType<typeof UserContext.default>);

        render(
            <Wrapper>
                <ThankYou {...defaultProps} />
            </Wrapper>
        );

        const firstNameInput = screen.getByPlaceholderText('Your first name') as HTMLInputElement;
        const lastNameInput = screen.getByPlaceholderText('Your last name') as HTMLInputElement;

        expect(firstNameInput.defaultValue).toBe('Alice');
        expect(lastNameInput.defaultValue).toBe('Johnson');
    });

    it('includes source as hidden field', () => {
        jest.spyOn(UserContext, 'default').mockReturnValue({
            userModel: {}
        } as ReturnType<typeof UserContext.default>);

        const {container} = render(
            <Wrapper>
                <ThankYou {...defaultProps} source="test-source-123" />
            </Wrapper>
        );

        const sourceInput = container.querySelector('input[name="source"]') as HTMLInputElement;
        expect(sourceInput).toBeInTheDocument();
        expect(sourceInput.value).toBe('test-source-123');
        expect(sourceInput.type).toBe('hidden');
    });

    it('includes track attribute on never-mind link when provided', () => {
        jest.spyOn(UserContext, 'default').mockReturnValue({
            userModel: {}
        } as ReturnType<typeof UserContext.default>);

        render(
            <Wrapper>
                <ThankYou {...defaultProps} track="test-track" />
            </Wrapper>
        );

        const neverMindLink = screen.getByText(/Never mind, just go to the PDF/i);
        expect(neverMindLink.getAttribute('data-track')).toBe('test-track');
    });

    it('does not include track attribute when not provided', () => {
        jest.spyOn(UserContext, 'default').mockReturnValue({
            userModel: {}
        } as ReturnType<typeof UserContext.default>);

        render(
            <Wrapper>
                <ThankYou {...defaultProps} />
            </Wrapper>
        );

        const neverMindLink = screen.getByText(/Never mind, just go to the PDF/i);
        expect(neverMindLink.getAttribute('data-track')).toBeNull();
    });
});
