import React from 'react';
import './chat-button.scss';

function initESW(gslbBaseURL) {
    // eslint-disable camelcase
    window.embedded_svc.settings.displayHelpButton = true;
    window.embedded_svc.settings.language = 'en-US'; // For example, enter 'en' or 'en-US'
    window.embedded_svc.settings.enabledFeatures = ['LiveAgent'];
    window.embedded_svc.settings.entryFeature = 'LiveAgent';

    window.embedded_svc.init(
        'https://openstax.my.salesforce.com',
        'https://openstax.my.site.com/help',
        gslbBaseURL,
        '00DU0000000Kwch',
        'CS_Chat_Group',
        {
            baseLiveAgentContentURL: 'https://c.la1-c2-ia5.salesforceliveagent.com/content',
            deploymentId: '5724P000000ghju',
            buttonId: '5736f0000004vgf',
            baseLiveAgentURL: 'https://d.la1-c2-ia5.salesforceliveagent.com/chat',
            eswLiveAgentDevName: 'CS_Chat_Group',
            isOfflineSupportEnabled: true
        }
    );
}

function bootChatButton() {
    if (!window.embedded_svc) {
        const s = document.createElement('script');

        s.setAttribute('src', 'https://openstax.my.salesforce.com/embeddedservice/5.0/esw.min.js');
        s.onload = () => initESW(null);
        document.body.appendChild(s);
    } else {
        initESW('https://service.force.com');
    }
}

export default function useChatButton() {
    React.useEffect(
        () => {
            bootChatButton();
            const b = document.querySelector('.embeddedServiceHelpButton');

            if (b) {
                b.style.removeProperty('display');
            }

            return () => {
                const b2 = document.querySelector('.embeddedServiceHelpButton');

                b2.style.setProperty('display', 'none');
            };
        },
        []
    );
}
