import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import Chat from '~/components/chat/chat';
import * as UserContext from '~/contexts/user';

// Mock the user context and scss
jest.mock('~/contexts/user');
jest.mock('~/components/chat/chat.scss', () => ({}));

describe('Chat', () => {
    let mockEmbeddedService: any;

    beforeEach(() => {
        // Clean up any existing scripts and global objects
        document.querySelectorAll('script[src*="bootstrap.min.js"]').forEach((el) => el.remove());
        delete (window as any).embeddedservice_bootstrap;
        delete (window as any).__salesforceChatInitialized;

        // Create mock embeddedservice_bootstrap
        mockEmbeddedService = {
            settings: {
                language: ''
            },
            init: jest.fn(),
            prechatAPI: {
                setHiddenPrechatFields: jest.fn()
            }
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('appends Salesforce bootstrap script once', () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);

        const scripts = document.querySelectorAll('script[src*="bootstrap.min.js"]');
        expect(scripts.length).toBe(1);
        expect(scripts[0].getAttribute('src')).toContain('bootstrap.min.js');
        expect(scripts[0].getAttribute('type')).toBe('text/javascript');
    });

    it('initializes embeddedservice_bootstrap when script loads', async () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(mockEmbeddedService.init).toHaveBeenCalledWith(
                '00DU0000000Kwch',
                'Web_Messaging_Deployment',
                'https://openstax.my.site.com/ESWWebMessagingDeployme1716235390398',
                {scrt2URL: 'https://openstax.my.salesforce-scrt.com'}
            );
        });
    });

    it('sets sProduct for anonymous users', async () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website'
            });
        });
    });

    it('sets user information for logged-in users', async () => {
        const mockUserContext = {
            userModel: {
                uuid: 'test-uuid-123',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                accountsModel: {
                    school_name: 'Test University'
                }
            }
        };

        (UserContext.default as jest.Mock).mockReturnValue(mockUserContext);

        render(<Chat />);

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website',
                OpenStax_UUID__c: 'test-uuid-123',
                FirstName: 'John',
                LastName: 'Doe',
                Email: 'john.doe@example.com',
                School: 'Test University'
            });
        });
    });

    it('sets partial user information when some fields are missing', async () => {
        const mockUserContext = {
            userModel: {
                uuid: 'test-uuid-123',
                first_name: 'John',
                // Missing last_name, email, school
            }
        };

        (UserContext.default as jest.Mock).mockReturnValue(mockUserContext);

        render(<Chat />);

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website',
                OpenStax_UUID__c: 'test-uuid-123',
                FirstName: 'John'
            });
        });
    });

    it('removes script on unmount', () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        const {unmount} = render(<Chat />);

        expect(document.querySelectorAll('script[src*="bootstrap.min.js"]').length).toBe(1);

        unmount();

        expect(document.querySelectorAll('script[src*="bootstrap.min.js"]').length).toBe(0);
    });

    it('handles script load error gracefully', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;
        script.onerror?.(new Event('error'));

        expect(consoleError).toHaveBeenCalledWith('Failed to load Salesforce chat script');

        consoleError.mockRestore();
    });

    it('only initializes once even if user context changes', async () => {
        const mockUserContext = {
            userModel: {
                uuid: 'test-uuid-123',
                first_name: 'John'
            }
        };

        (UserContext.default as jest.Mock).mockReturnValue(mockUserContext);

        const {rerender} = render(<Chat />);

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
        });

        // Update user context
        (UserContext.default as jest.Mock).mockReturnValue({
            userModel: {
                uuid: 'test-uuid-123',
                first_name: 'Jane'
            }
        });

        rerender(<Chat />);

        // Should not initialize again
        expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
    });

    it('updates pre-chat fields when user logs in after initialization', async () => {
        // Start with anonymous user
        (UserContext.default as jest.Mock).mockReturnValue({});

        const {rerender} = render(<Chat />);

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
        });

        // Verify initial fields (anonymous user)
        expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
            sProduct: 'Website'
        });

        // Clear mock calls
        mockEmbeddedService.prechatAPI.setHiddenPrechatFields.mockClear();

        // Simulate user logging in
        (UserContext.default as jest.Mock).mockReturnValue({
            userModel: {
                uuid: 'test-uuid-456',
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'jane.doe@example.com',
                accountsModel: {
                    school_name: 'Example University'
                }
            }
        });

        rerender(<Chat />);

        // Verify fields updated with user information
        await waitFor(() => {
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website',
                OpenStax_UUID__c: 'test-uuid-456',
                FirstName: 'Jane',
                LastName: 'Doe',
                Email: 'jane.doe@example.com',
                School: 'Example University'
            });
        });

        // Init should still only have been called once
        expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
    });

    it('preserves initialization state across component remounts', async () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        const {unmount} = render(<Chat />);

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load and initialization
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
        });

        // Unmount component
        unmount();

        // Remount component
        render(<Chat />);

        // Wait a bit to ensure no re-initialization
        await new Promise(resolve => setTimeout(resolve, 100));

        // Init should still only have been called once (state persists via window flag)
        expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
    });
});
