import React from 'react';
import useUserContext from '~/contexts/user';
import './chat.scss';

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
            prechatAPI?: {
                setHiddenPrechatFields: (fields: Record<string, string>) => void;
                setPrechatFormFieldValue: (fieldName: string, value: string, readOnly?: boolean) => void;
            };
        };
        __salesforceChatInitialized?: boolean;
    }
}

const SALESFORCE_CONFIG = {
    orgId: '00DU0000000Kwch',
    deploymentName: 'Web_Messaging_Deployment',
    baseUrl: 'https://openstax.my.site.com/ESWWebMessagingDeployme1716235390398',
    scrt2URL: 'https://openstax.my.salesforce-scrt.com',
    bootstrapScript: 'https://openstax.my.site.com/ESWWebMessagingDeployme1716235390398/assets/js/bootstrap.min.js'
};

function initEmbeddedMessaging(): boolean {
    try {
        if (window.embeddedservice_bootstrap) {
            window.embeddedservice_bootstrap.settings.language = 'en_US';
            window.embeddedservice_bootstrap.init(
                SALESFORCE_CONFIG.orgId,
                SALESFORCE_CONFIG.deploymentName,
                SALESFORCE_CONFIG.baseUrl,
                {scrt2URL: SALESFORCE_CONFIG.scrt2URL}
            );
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error initializing Salesforce chat:', err);
        return false;
    }
}

// eslint-disable-next-line complexity
export default function Chat() {
    const userContext = useUserContext();
    const [scriptLoaded, setScriptLoaded] = React.useState(false);

    // Derive stable user primitives from userStatus (which is always available)
    // with fallback to userModel when available
    const userStatus = userContext?.userStatus;
    const userModel = userContext?.userModel;
    const uuid = userStatus?.uuid || userModel?.uuid;
    const firstName = userStatus?.firstName || userModel?.first_name;
    const lastName = userStatus?.lastName || userModel?.last_name;
    const email = userStatus?.email || userModel?.email;
    const school = userStatus?.school || userModel?.accountsModel?.school_name;

    // Load Salesforce script once, or short-circuit if already loaded
    React.useEffect(() => {
        let script: HTMLScriptElement | null = null;

        // Short-circuit if bootstrap is already available from a previous mount
        if (window.embeddedservice_bootstrap) {
            setScriptLoaded(true);
        } else {
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
        }

        // Always return cleanup function to hide widget on unmount
        return () => {
            if (script && document.body.contains(script)) {
                // Clear handlers to prevent setState on unmounted component
                script.onload = null;
                script.onerror = null;
                document.body.removeChild(script);
            }
            // Hide the chat widget when component unmounts
            // The Salesforce widget injects elements with these selectors
            const chatElement = document.getElementById('embedded-messaging');

            if (chatElement) {
                chatElement.style.display = 'none';
            }
            // Note: Don't delete window.embeddedservice_bootstrap or __salesforceChatInitialized
            // to maintain conversation state across component remounts
        };
    }, []);

    // Show chat widget when component mounts (if it was previously hidden)
    React.useEffect(() => {
        if (scriptLoaded && window.__salesforceChatInitialized) {
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

        // Only initialize if not already initialized (persists across component remounts)
        if (!window.__salesforceChatInitialized) {
            const success = initEmbeddedMessaging();

            // Only set the flag if initialization succeeded
            if (success) {
                window.__salesforceChatInitialized = true;
            }
        }
    }, [scriptLoaded]);

    // Update pre-chat fields whenever user information changes
    // This allows fields to update when a user logs in after chat is initialized
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (!scriptLoaded || !window.embeddedservice_bootstrap?.prechatAPI) {
            return;
        }

        const prechatAPI = window.embeddedservice_bootstrap.prechatAPI;

        // Set hidden fields: sProduct and UUID (not editable by user)
        const hiddenFields: Record<string, string> = {
            sProduct: 'Website'
        };

        if (uuid) {
            hiddenFields.OpenStax_UUID__c = uuid; // eslint-disable-line camelcase
        }

        prechatAPI.setHiddenPrechatFields(hiddenFields);

        // Set visible, editable fields: FirstName, LastName, Email, School
        // These will be pre-filled but users can review and edit them before starting chat
        if (firstName && prechatAPI.setPrechatFormFieldValue) {
            prechatAPI.setPrechatFormFieldValue('FirstName', firstName, false);
        }
        if (lastName && prechatAPI.setPrechatFormFieldValue) {
            prechatAPI.setPrechatFormFieldValue('LastName', lastName, false);
        }
        if (email && prechatAPI.setPrechatFormFieldValue) {
            prechatAPI.setPrechatFormFieldValue('Email', email, false);
        }
        if (school && prechatAPI.setPrechatFormFieldValue) {
            prechatAPI.setPrechatFormFieldValue('School', school, false);
        }
    }, [scriptLoaded, uuid, firstName, lastName, email, school]);

    return null;
}
