import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
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
        } as unknown as ReturnType<typeof UserContext.default>);

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

    describe('photo and video attachment', () => {
        beforeEach(() => {
            jest.spyOn(UserContext, 'default').mockReturnValue({
                userModel: {}
            } as ReturnType<typeof UserContext.default>);
        });

        function renderForm() {
            return render(
                <Wrapper>
                    <ThankYou {...defaultProps} />
                </Wrapper>
            );
        }

        it('posts as multipart form data so a file can travel with the note', () => {
            const {container} = renderForm();

            expect(container.querySelector('form')).toHaveAttribute(
                'enctype',
                'multipart/form-data'
            );
        });

        it('offers an optional photo or video upload', () => {
            const {container} = renderForm();
            const fileInput = container.querySelector('input[type="file"]');

            expect(
                screen.getByRole('group', {name: /Optional: Upload a photo or video of yourself/})
            ).toBeInTheDocument();
            expect(fileInput).toHaveAttribute('name', 'attachment');
            expect(fileInput).toHaveAttribute(
                'accept',
                '.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.mp4,.mov,.m4v,.webm'
            );
            expect(fileInput).not.toBeRequired();
        });

        it('shows the chosen file and lets it be cleared', async () => {
            const user = userEvent.setup();
            const {container} = renderForm();
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            await user.upload(fileInput, new File(['x'], 'me-with-book.png', {type: 'image/png'}));
            expect(screen.getByText('me-with-book.png')).toBeInTheDocument();

            await user.click(screen.getByRole('button', {name: 'Clear file'}));
            expect(screen.queryByText('me-with-book.png')).toBeNull();
            // The file must not still be in the input, or it would be submitted
            expect(fileInput.files).toHaveLength(0);
            expect(fileInput.value).toBe('');
        });

        it('turns away a type of file the CMS would reject, instead of submitting it', async () => {
            const user = userEvent.setup({applyAccept: false});
            const {container} = renderForm();
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            await user.upload(fileInput, new File(['<svg/>'], 'me.SVG', {type: 'image/svg+xml'}));

            expect(screen.getByRole('alert')).toHaveTextContent(
                /That type of file can't be attached. Choose a JPG, JPEG, PNG.*WEBM file./
            );
            expect(fileInput.files).toHaveLength(0);
            expect(screen.queryByText('me.SVG')).toBeNull();
            expect(screen.getByRole('button', {name: 'Add file'})).toBeInTheDocument();
        });

        it('accepts an allowed extension in any letter case', async () => {
            const user = userEvent.setup();
            const {container} = renderForm();
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            await user.upload(fileInput, new File(['x'], 'IMG_0001.HEIC', {type: ''}));

            expect(screen.getByText('IMG_0001.HEIC')).toBeInTheDocument();
            expect(screen.queryByRole('alert')).toBeNull();
        });

        it('turns away a file over the CMS size limit, with the limit in the message', async () => {
            const user = userEvent.setup();
            const {container} = renderForm();
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            const big = new File(['x'], 'long-video.mp4', {type: 'video/mp4'});

            Object.defineProperty(big, 'size', {value: 100 * 1024 * 1024 + 1});
            await user.upload(fileInput, big);

            expect(screen.getByRole('alert')).toHaveTextContent('That file is too large. The limit is 100 MB.');
            expect(fileInput.files).toHaveLength(0);
        });

        it('takes a file of exactly the limit, and drops the message once a good file is chosen', async () => {
            const user = userEvent.setup({applyAccept: false});
            const {container} = renderForm();
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            const exact = new File(['x'], 'long-video.mp4', {type: 'video/mp4'});

            await user.upload(fileInput, new File(['x'], 'notes.pdf', {type: 'application/pdf'}));
            expect(screen.getByRole('alert')).toBeInTheDocument();

            Object.defineProperty(exact, 'size', {value: 100 * 1024 * 1024});
            await user.upload(fileInput, exact);
            expect(screen.queryByRole('alert')).toBeNull();
            expect(screen.getByText('long-video.mp4')).toBeInTheDocument();
        });

        it.each([['Enter', '{Enter}'], ['Space', ' ']])(
            'opens the file picker from the keyboard with %s',
            async (_name, keys) => {
                const user = userEvent.setup();
                const {container} = renderForm();
                const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
                const openPicker = jest.spyOn(fileInput, 'click');

                screen.getByRole('button', {name: 'Add file'}).focus();
                await user.keyboard(keys);

                expect(openPicker).toHaveBeenCalledTimes(1);
            }
        );

        it('ignores other keys on the Add file button', async () => {
            const user = userEvent.setup();
            const {container} = renderForm();
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            const openPicker = jest.spyOn(fileInput, 'click');

            screen.getByRole('button', {name: 'Add file'}).focus();
            await user.keyboard('a');

            expect(openPicker).not.toHaveBeenCalled();
        });

        it('requires consent, which now covers the use of an uploaded image, voice and name', () => {
            renderForm();

            const consent = screen.getByRole('checkbox', {
                name: /grant OpenStax the right to use my image, voice, and name/
            });

            expect(consent).toBeRequired();
            expect(consent).toHaveAttribute('name', 'consent_to_share_or_contact');
        });
    });
});
