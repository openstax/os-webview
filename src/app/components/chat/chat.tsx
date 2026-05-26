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
            };
        };
    }
}

const SALESFORCE_CONFIG = {
    orgId: '00DU0000000Kwch',
    deploymentName: 'Web_Messaging_Deployment',
    baseUrl: 'https://openstax.my.site.com/ESWWebMessagingDeployme1716235390398',
    scrt2URL: 'https://openstax.my.salesforce-scrt.com',
    bootstrapScript: 'https://openstax.my.site.com/ESWWebMessagingDeployme1716235390398/assets/js/bootstrap.min.js'
};

function initEmbeddedMessaging() {
    try {
        if (window.embeddedservice_bootstrap) {
            window.embeddedservice_bootstrap.settings.language = 'en_US';
            window.embeddedservice_bootstrap.init(
                SALESFORCE_CONFIG.orgId,
                SALESFORCE_CONFIG.deploymentName,
                SALESFORCE_CONFIG.baseUrl,
                {scrt2URL: SALESFORCE_CONFIG.scrt2URL}
            );
        }
    } catch (err) {
        console.error('Error initializing Salesforce chat:', err);
    }
}

// eslint-disable-next-line complexity
export default function Chat() {
    const userContext = useUserContext();
    const [scriptLoaded, setScriptLoaded] = React.useState(false);
    const initializedRef = React.useRef(false);

    // Derive stable user primitives
    const userModel = userContext?.userModel;
    const uuid = userModel?.uuid;
    const firstName = userModel?.first_name;
    const lastName = userModel?.last_name;
    const email = userModel?.email;
    const school = userModel?.accountsModel?.school_name;

    // Load Salesforce script once
    React.useEffect(() => {
        const script = document.createElement('script');

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

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            // Note: Don't delete window.embeddedservice_bootstrap to maintain
            // conversation state across component remounts
        };
    }, []);

    // Initialize chat once and set user fields
    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (!scriptLoaded || !window.embeddedservice_bootstrap || initializedRef.current) {
            return;
        }

        // Set sProduct for all users (logged in or not)
        const hiddenFields: Record<string, string> = {
            sProduct: 'Website'
        };

        // Add user information if available
        if (uuid) {
            hiddenFields.OpenStax_UUID__c = uuid; // eslint-disable-line camelcase
        }
        if (firstName) {
            hiddenFields.FirstName = firstName;
        }
        if (lastName) {
            hiddenFields.LastName = lastName;
        }
        if (email) {
            hiddenFields.Email = email;
        }
        if (school) {
            hiddenFields.School = school;
        }

        if (window.embeddedservice_bootstrap.prechatAPI) {
            window.embeddedservice_bootstrap.prechatAPI.setHiddenPrechatFields(hiddenFields);
        }

        initEmbeddedMessaging();
        initializedRef.current = true;
    }, [scriptLoaded, uuid, firstName, lastName, email, school]);

    return null;
}
