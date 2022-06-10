import React from 'react';
import LanguageSelector from '~/components/language-selector/language-selector';

const leadInText = {
    en: 'We have textbooks in',
    es: 'Tenemos libros de texto en'
};

export default function LanguageSelectorSection({otherLocales}) {
    return (
        <section className="language-selector-section">
            <div className="content">
                <LanguageSelector leadInText={leadInText} otherLocales={otherLocales} />
            </div>
        </section>
    );
}
