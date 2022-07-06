import React from 'react';
import LanguageSelector from '~/components/language-selector/language-selector';
import {FormattedMessage} from 'react-intl';

export default function LanguageSelectorSection({otherLocales}) {
    const LeadIn = React.useCallback(
        () => <FormattedMessage id="weHaveBooksIn" defaultMessage="We have textbooks in" />,
        []
    );

    return (
        <section className="language-selector-section">
            <div className="content">
                <LanguageSelector LeadIn={LeadIn} otherLocales={otherLocales} />
            </div>
        </section>
    );
}
