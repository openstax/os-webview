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

export default function Chat() {
    const userContext = useUserContext();
    const [scriptLoaded, setScriptLoaded] = React.useState(false);

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
            if (window.embeddedservice_bootstrap) {
                delete window.embeddedservice_bootstrap;
            }
        };
    }, []);

    // eslint-disable-next-line complexity
    React.useEffect(() => {
        if (!scriptLoaded || !window.embeddedservice_bootstrap) {
            return;
        }

        const userModel = userContext?.userModel;

        if (userModel && window.embeddedservice_bootstrap.prechatAPI) {
            const hiddenFields: Record<string, string> = {
                sProduct: 'Website'
            };

            if (userModel.uuid) {
                hiddenFields.OpenStax_UUID__c = userModel.uuid; // eslint-disable-line camelcase
            }

            window.embeddedservice_bootstrap.prechatAPI.setHiddenPrechatFields(hiddenFields);
        }

        initEmbeddedMessaging();
    }, [scriptLoaded, userContext]);

    return null;
}
