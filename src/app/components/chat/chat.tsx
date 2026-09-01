import React from 'react';
import useUserContext from '~/contexts/user';
import {assertDefined} from '~/helpers/data';
import './chat.scss';

type VisibleFieldArg = {
    value: string,
    isEditableByEndUser: boolean
}

const IDLE_CALLBACK_FALLBACK_DELAY = 200;

declare global {
    interface Window {
        embeddedservice_bootstrap?: {
            settings: {
                language: string;
            };
            init: (
                orgId: string,
                deploymentName: string,
                baseUrl: string,
                options: {scrt2URL: string}
            ) => void;
            utilAPI?: {
                showChatButton: () => void;
                hideChatButton: () => void;
            };
            prechatAPI?: {
                setHiddenPrechatFields: (fields: Record<string, string>) => void;
                setVisiblePrechatFields: (fields: Record<string, VisibleFieldArg>) => void;
            };
        };
        // Set once init() succeeds; gates prechat + visibility handling.
        __salesforceChatInitialized?: boolean;
        // Set as soon as init() is attempted (success or failure) so a failed
        // init is never retried on a later mount. Re-running init() against a
        // half-initialized SDK stacks another businessHoursTimerCallback timer
        // on top of the broken one, and those orphaned timers are what throw
        // `Cannot read properties of undefined (reading 'hideChatButton')`.
        __salesforceChatInitAttempted?: boolean;
    }
}

const SALESFORCE_CONFIG = {
    orgId: '00DU0000000Kwch',
    deploymentName: 'Web_Messaging_Deployment',
    baseUrl: 'https://openstax.my.site.com/ESWWebMessagingDeployme1716235390398',
    scrt2URL: 'https://openstax.my.salesforce-scrt.com',
    bootstrapScript: 'https://openstax.my.site.com/ESWWebMessagingDeployme1716235390398/assets/js/bootstrap.min.js'
};

function requestIdle(callback: () => void): () => void {
    if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(callback);

        return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(callback, IDLE_CALLBACK_FALLBACK_DELAY);

    return () => window.clearTimeout(id);
}

function preconnect(href: string) {
    if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        return;
    }
    const link = document.createElement('link');

    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
}

function initEmbeddedMessaging(): boolean {
    // Value is guaranteed present by the caller
    const bootstrap = assertDefined(window.embeddedservice_bootstrap);

    // Record the attempt before calling init(). init() wires up the SDK's
    // internal business-hours timer early and may throw before the widget is
    // fully built; marking the attempt up-front guarantees we never re-init
    // over that partial state (which would orphan another timer).
    window.__salesforceChatInitAttempted = true;

    try {
        bootstrap.settings.language = 'en_US';
        bootstrap.init(
            SALESFORCE_CONFIG.orgId,
            SALESFORCE_CONFIG.deploymentName,
            SALESFORCE_CONFIG.baseUrl,
            {scrt2URL: SALESFORCE_CONFIG.scrt2URL}
        );
        return true;
    } catch (err) {
        console.error('Error initializing Salesforce chat:', err);
        return false;
    }
}

// Toggle the widget through Salesforce's own show/hide API so the SDK keeps a
// consistent view of the button across SPA navigation. Every access is guarded:
// the API only exists after the vendor bundle boots, calling it before the
// button is created (or while a chat window is open) can throw, and we must
// never let our own code raise the unhandled error we're trying to prevent.
function setChatButtonVisible(visible: boolean): void {
    const utilAPI = window.embeddedservice_bootstrap?.utilAPI;

    if (!utilAPI) {
        return;
    }
    try {
        if (visible) {
            utilAPI.showChatButton();
        } else {
            utilAPI.hideChatButton();
        }
    } catch (err) {
        console.error('Error toggling Salesforce chat button:', err);
    }
}

export default function Chat() {
    const userContext = useUserContext();
    const [scriptLoaded, setScriptLoaded] = React.useState(false);
    const [prechatLoaded, setPrechatLoaded] = React.useState(false);

    // Derive stable user primitives from userStatus (which is always available)
    // with fallback to userModel when available
    const userStatus = userContext?.userStatus;
    const userModel = userContext?.userModel;

    // Hide the chat button on every unmount, regardless of how the script loaded.
    // This effect runs on unmount unconditionally so later navigations (where the
    // script-loading effect short-circuits) still hide the button correctly.
    React.useEffect(() => () => {
        // Prefer the vendor's own API so the SDK's business-hours timer keeps
        // operating on a live widget; fall back to hiding the injected container
        // when the API isn't ready yet.
        setChatButtonVisible(false);
        const chatElement = document.getElementById('embedded-messaging');

        if (chatElement) {
            chatElement.style.display = 'none';
        }
        // Note: Don't delete window.embeddedservice_bootstrap or the init
        // flags. The SDK is a page-lifetime singleton with no teardown API;
        // re-initializing it is what orphans the timer that throws.
    }, []);

    // Load Salesforce script once, or short-circuit if already loaded
    React.useEffect(() => {
        let script: HTMLScriptElement | null = null;

        // Short-circuit if bootstrap is already available from a previous mount
        if (window.embeddedservice_bootstrap) {
            setScriptLoaded(true);

            return undefined;
        }

        // Warm the connection now so it's ready by the time the idle-deferred script loads
        preconnect(SALESFORCE_CONFIG.baseUrl);
        preconnect(SALESFORCE_CONFIG.scrt2URL);

        // Defer the heavy Salesforce bundle until the browser is idle so it doesn't
        // compete with the page's own rendering and data fetching
        const cancelIdle = requestIdle(() => {
            script = document.createElement('script');

            script.src = SALESFORCE_CONFIG.bootstrapScript;
            script.type = 'text/javascript';
            script.async = true;

            script.onload = () => {
                setScriptLoaded(true);
            };

            script.onerror = () => {
                console.error('Failed to load Salesforce chat script');
            };

            document.body.appendChild(script);
        });

        return () => {
            cancelIdle();
            if (script && document.body.contains(script)) {
                // Clear handlers to prevent setState on unmounted component
                script.onload = null;
                script.onerror = null;
                document.body.removeChild(script);
            }
        };
    }, []);

    // Show chat widget when component mounts (if it was previously hidden)
    React.useEffect(() => {
        if (scriptLoaded && window.__salesforceChatInitialized) {
            setChatButtonVisible(true);
            const chatElement = document.getElementById('embedded-messaging');

            if (chatElement) {
                chatElement.style.removeProperty('display');
            }
        }
    }, [scriptLoaded]);

    // Initialize chat widget once (on first mount or after refresh)
    React.useEffect(() => {
        if (!scriptLoaded || !window.embeddedservice_bootstrap) {
            return;
        }

        // Initialize at most once per page load. Guard on "attempted" (not
        // "succeeded") so a failed init is never retried on a later mount —
        // retrying stacks another orphaned business-hours timer that throws.
        if (!window.__salesforceChatInitAttempted) {
            const success = initEmbeddedMessaging();

            // Only set the success flag when init actually completed
            if (success) {
                window.__salesforceChatInitialized = true;
            }
        }
    }, [scriptLoaded]);

    // Update pre-chat fields whenever user information changes
    // This allows fields to update when a user logs in after chat is initialized
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (!scriptLoaded || !prechatLoaded) {
            return;
        }

        // prechatLoaded is only true when prechatAPI exists (see polling effect below),
        // so we can safely access it without additional null checks
        const prechatAPI = assertDefined(window.embeddedservice_bootstrap?.prechatAPI);

        // Set hidden fields: Product and UUID (not editable by user)
        const hiddenFields: Record<string, string> = {
            Product: 'Website'
        };
        const visibleFields: Record<string, VisibleFieldArg> = {};
        const uuid = userStatus?.uuid || userModel?.uuid;
        const firstName = userStatus?.firstName || userModel?.first_name;
        const lastName = userStatus?.lastName || userModel?.last_name;
        const email = userStatus?.email || userModel?.email;
        const school = userStatus?.school || userModel?.accountsModel?.school_name;


        if (uuid) {
            hiddenFields.OpenStax_UUID = uuid; // eslint-disable-line camelcase
        }

        prechatAPI.setHiddenPrechatFields(hiddenFields);
        function setVisibleField(name: string, value: string) {
            visibleFields[`_${name}`] = {
                value,
                isEditableByEndUser: false
            };
        }

        // Set visible, editable fields: FirstName, LastName, Email, School
        // These will be pre-filled but users can review and edit them before starting chat
        if (firstName) {
            setVisibleField('firstName', firstName);
        }
        if (lastName) {
            setVisibleField('lastName', lastName);
        }
        if (email) {
            setVisibleField('email', email);
        }
        if (school) {
            // it breaks the pattern
            visibleFields.School = {value: school, isEditableByEndUser: true};
        }
        prechatAPI.setVisiblePrechatFields(visibleFields);
    }, [scriptLoaded, prechatLoaded, userModel, userStatus]);

    // Polling for prechatAPI to be available
    React.useEffect(() => {
        const i = setInterval(() => {
            const prechatAPI = window.embeddedservice_bootstrap?.prechatAPI;

            if (prechatAPI) {
                setPrechatLoaded(true);
                clearInterval(i);
            }
        }, 250);

        return () => clearInterval(i);
    }, []);

    return null;
}
