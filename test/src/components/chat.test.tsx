import React from 'react';
import {act, render, waitFor} from '@testing-library/preact';
import Chat from '~/components/chat/chat';
import * as UserContext from '~/contexts/user';

// Mock the user context and scss
jest.mock('~/contexts/user');
jest.mock('~/components/chat/chat.scss', () => ({}));

// The bootstrap script load is deferred until idle (jsdom has no requestIdleCallback,
// so it falls back to a 200ms timeout) - advance past that before asserting on the script
function flushIdleCallback() {
    act(() => {
        jest.advanceTimersByTime(200);
    });
}

describe('Chat', () => {
    let mockEmbeddedService: any;

    beforeEach(() => {
        // Clean up any existing scripts and global objects
        document.querySelectorAll('script[src*="bootstrap.min.js"]').forEach((el) => el.remove());
        document.querySelectorAll('link[rel="preconnect"]').forEach((el) => el.remove());
        delete (window as any).embeddedservice_bootstrap;
        delete (window as any).__salesforceChatInitialized;

        // Enable fake timers for polling interval
        jest.useFakeTimers();

        // Create mock embeddedservice_bootstrap
        mockEmbeddedService = {
            settings: {
                language: ''
            },
            init: jest.fn(),
            prechatAPI: {
                setHiddenPrechatFields: jest.fn(),
                setVisiblePrechatFields: jest.fn()
            }
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('appends Salesforce bootstrap script once', () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);
        flushIdleCallback();

        const scripts = document.querySelectorAll('script[src*="bootstrap.min.js"]');
        expect(scripts.length).toBe(1);
        expect(scripts[0].getAttribute('src')).toContain('bootstrap.min.js');
        expect(scripts[0].getAttribute('type')).toBe('text/javascript');
    });

    it('initializes embeddedservice_bootstrap when script loads', async () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);
        flushIdleCallback();

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
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        // Advance timers to trigger polling interval and make prechatAPI available
        jest.advanceTimersByTime(250);

        await waitFor(() => {
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website'
            });
            expect(mockEmbeddedService.prechatAPI.setVisiblePrechatFields).toHaveBeenCalledWith({});
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
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        // Advance timers to trigger polling interval and make prechatAPI available
        jest.advanceTimersByTime(250);

        await waitFor(() => {
            // Hidden fields: sProduct and UUID only
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website',
                OpenStax_UUID__c: 'test-uuid-123'
            });

            // Visible, editable fields: Name, Email, School
            expect(mockEmbeddedService.prechatAPI.setVisiblePrechatFields).toHaveBeenCalledWith({
                _firstName: {value: 'John', isEditableByEndUser: false},
                _lastName: {value: 'Doe', isEditableByEndUser: false},
                _email: {value: 'john.doe@example.com', isEditableByEndUser: false},
                School: {value: 'Test University', isEditableByEndUser: true}
            });
        });
    });

    it('sets partial user information when some fields are missing', async () => {
        const mockUserContext = {
            userModel: {
                uuid: 'test-uuid-123',
                first_name: 'John'
                // Missing last_name, email, school
            }
        };

        (UserContext.default as jest.Mock).mockReturnValue(mockUserContext);

        render(<Chat />);
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        // Advance timers to trigger polling interval and make prechatAPI available
        jest.advanceTimersByTime(250);

        await waitFor(() => {
            // Hidden fields: sProduct and UUID
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website',
                OpenStax_UUID__c: 'test-uuid-123'
            });

            // Only FirstName should be set as visible field (others are missing)
            expect(mockEmbeddedService.prechatAPI.setVisiblePrechatFields).toHaveBeenCalledWith({
                _firstName: {value: 'John', isEditableByEndUser: false}
            });
        });
    });

    it('removes script on unmount', () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        const {unmount} = render(<Chat />);
        flushIdleCallback();

        expect(document.querySelectorAll('script[src*="bootstrap.min.js"]').length).toBe(1);

        unmount();

        expect(document.querySelectorAll('script[src*="bootstrap.min.js"]').length).toBe(0);
    });

    it('handles script load error gracefully', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);
        flushIdleCallback();

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
        flushIdleCallback();

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
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        // Advance timers to trigger polling interval and make prechatAPI available
        jest.advanceTimersByTime(250);

        await waitFor(() => {
            expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
        });

        // Verify initial fields (anonymous user)
        expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
            sProduct: 'Website'
        });
        expect(mockEmbeddedService.prechatAPI.setVisiblePrechatFields).toHaveBeenCalledWith({});

        // Clear mock calls
        mockEmbeddedService.prechatAPI.setHiddenPrechatFields.mockClear();
        mockEmbeddedService.prechatAPI.setVisiblePrechatFields.mockClear();

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
            // Hidden fields: sProduct and UUID
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website',
                OpenStax_UUID__c: 'test-uuid-456'
            });

            // Visible fields: Name, Email, School
            expect(mockEmbeddedService.prechatAPI.setVisiblePrechatFields).toHaveBeenCalledWith({
                _firstName: {value: 'Jane', isEditableByEndUser: false},
                _lastName: {value: 'Doe', isEditableByEndUser: false},
                _email: {value: 'jane.doe@example.com', isEditableByEndUser: false},
                School: {value: 'Example University', isEditableByEndUser: true}
            });
        });

        // Init should still only have been called once
        expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
    });

    it('preserves initialization state across component remounts', async () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        const {unmount} = render(<Chat />);
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load and initialization
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);
        });

        // Unmount component
        unmount();

        // Verify script was removed from DOM
        expect(document.querySelectorAll('script[src*="bootstrap.min.js"]').length).toBe(0);

        // Remount component - bootstrap object still exists in window, so no new script is created
        render(<Chat />);

        // Because window.embeddedservice_bootstrap still exists, the component short-circuits
        // and doesn't inject a new script. scriptLoaded is set immediately.
        // The initialization effect sees __salesforceChatInitialized is already true and doesn't re-init.
        expect(mockEmbeddedService.init).toHaveBeenCalledTimes(1);

        // Verify no new script was added (short-circuit logic worked)
        expect(document.querySelectorAll('script[src*="bootstrap.min.js"]').length).toBe(0);
    });

    it('hides chat widget element on unmount', () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        // Create the embedded-messaging element that Salesforce would inject
        const chatElement = document.createElement('div');
        chatElement.id = 'embedded-messaging';
        document.body.appendChild(chatElement);

        const {unmount} = render(<Chat />);

        expect(chatElement.style.display).toBe('');

        unmount();

        // Verify the chat element is hidden
        expect(chatElement.style.display).toBe('none');

        // Cleanup
        document.body.removeChild(chatElement);
    });

    it('shows chat widget element on remount when already initialized', async () => {
        (UserContext.default as jest.Mock).mockReturnValue({});

        // Create the embedded-messaging element that Salesforce would inject
        const chatElement = document.createElement('div');
        chatElement.id = 'embedded-messaging';
        chatElement.style.display = 'none';
        document.body.appendChild(chatElement);

        // Set up as if chat was already initialized from a previous mount
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        (window as any).__salesforceChatInitialized = true;

        render(<Chat />);

        await waitFor(() => {
            expect(chatElement.style.display).toBe('');
        });

        // Cleanup
        document.body.removeChild(chatElement);
    });

    it('handles initialization failure when embeddedservice_bootstrap is not available', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load but don't set window.embeddedservice_bootstrap
        script.onload?.(new Event('load'));

        // Wait a bit to ensure initialization is attempted
        await waitFor(() => {
            expect((window as any).__salesforceChatInitialized).toBeUndefined();
        });

        // Verify initialization was not marked as complete
        expect((window as any).__salesforceChatInitialized).toBeUndefined();

        consoleError.mockRestore();
    });

    it('handles initialization error and logs to console', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation();
        (UserContext.default as jest.Mock).mockReturnValue({});

        render(<Chat />);
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load with a bootstrap that throws during init
        const errorMessage = 'Init failed';
        const throwingMockService = {
            settings: {
                language: ''
            },
            init: jest.fn(() => {
                throw new Error(errorMessage);
            })
        };

        (window as any).embeddedservice_bootstrap = throwingMockService;
        script.onload?.(new Event('load'));

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalledWith(
                'Error initializing Salesforce chat:',
                expect.any(Error)
            );
        });

        // Verify initialization was not marked as complete
        expect((window as any).__salesforceChatInitialized).toBeUndefined();

        consoleError.mockRestore();
    });

    it('does not update prechat fields when prechatAPI is not available', async () => {
        const mockUserContext = {
            userModel: {
                uuid: 'test-uuid-123',
                first_name: 'John'
            }
        };

        (UserContext.default as jest.Mock).mockReturnValue(mockUserContext);

        render(<Chat />);
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load with a bootstrap that has no prechatAPI
        const noPrechatMockService = {
            settings: {
                language: ''
            },
            init: jest.fn()
        };

        (window as any).embeddedservice_bootstrap = noPrechatMockService;
        script.onload?.(new Event('load'));

        // Advance timers but prechatAPI never becomes available
        jest.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(noPrechatMockService.init).toHaveBeenCalledTimes(1);
        });

        // Verify no prechatAPI methods were called (because it doesn't exist)
        expect(noPrechatMockService.init).toHaveBeenCalled();
    });

    it('uses userStatus fields when available instead of userModel', async () => {
        const mockUserContext = {
            userStatus: {
                uuid: 'status-uuid-789',
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
                school: 'Status School'
            },
            userModel: {
                uuid: 'model-uuid-456',
                first_name: 'Bob',
                last_name: 'Jones',
                email: 'bob.jones@example.com',
                accountsModel: {
                    school_name: 'Model School'
                }
            }
        };

        (UserContext.default as jest.Mock).mockReturnValue(mockUserContext);

        render(<Chat />);
        flushIdleCallback();

        const script = document.querySelector('script[src*="bootstrap.min.js"]') as HTMLScriptElement;

        // Simulate script load
        (window as any).embeddedservice_bootstrap = mockEmbeddedService;
        script.onload?.(new Event('load'));

        // Advance timers to trigger polling interval and make prechatAPI available
        jest.advanceTimersByTime(250);

        await waitFor(() => {
            // Should use userStatus fields (not userModel)
            expect(mockEmbeddedService.prechatAPI.setHiddenPrechatFields).toHaveBeenCalledWith({
                sProduct: 'Website',
                OpenStax_UUID__c: 'status-uuid-789'
            });

            expect(mockEmbeddedService.prechatAPI.setVisiblePrechatFields).toHaveBeenCalledWith({
                _firstName: {value: 'Alice', isEditableByEndUser: false},
                _lastName: {value: 'Smith', isEditableByEndUser: false},
                _email: {value: 'alice.smith@example.com', isEditableByEndUser: false},
                School: {value: 'Status School', isEditableByEndUser: true}
            });
        });
    });
});
