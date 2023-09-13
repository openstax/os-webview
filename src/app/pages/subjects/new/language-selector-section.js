import React from 'react';
import LanguageSelector from '~/components/language-selector/language-selector';
import {FormattedMessage} from 'react-intl';

export default function LanguageSelectorSection({otherLocales}) {
    return (
        <section className='language-selector-section'>
            <div className='content'>
                <LanguageSelector LeadIn={LeadIn} otherLocales={otherLocales} />
            </div>
        </section>
    );
}

function LeadIn() {
    return (
        <FormattedMessage
            id='weHaveBooksIn'
            defaultMessage='We have textbooks in'
        />
    );
}
