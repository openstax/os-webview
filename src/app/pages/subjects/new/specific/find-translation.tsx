import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import usePageData from '~/helpers/use-page-data';
import type {LocaleEntry} from '~/components/language-selector/language-selector';
import useLanguageContext from '~/contexts/language';
import {useIntl} from 'react-intl';

type PageData = {
    error?: string;
    translations: LocaleEntry[][];
}

export default function FindTranslation() {
    const subject = useParams().subject;
    const pageData = usePageData<PageData>(`pages/${subject}-books`);

    if (!pageData) {
        return null;
    }
    if (pageData.error || !pageData.translations[0]) {
        return <NotAvailable />;
    }

    return <NavigateToTranslation translations={pageData.translations[0]} />;
}

function NavigateToTranslation({translations}: {translations: LocaleEntry[]}) {
    const {language} = useLanguageContext();
    const tx = translations.find((t) => t.locale === language);
    const navigate = useNavigate();

    if (!tx) {
        return <NotAvailable />;
    }
    window.setTimeout(() => {
        navigate(`/subjects/${tx.slug.replace('-books', '')}`, {replace: true});
    }, 0);
    return null;
}

function NotAvailable() {
    const {formatMessage} = useIntl();

    return (
        <div className='boxed'>
            <h1>
                {formatMessage({id: 'subject.notAvailableText'})}{' '}
                <a href='/subjects'>
                    {formatMessage({id: 'subject.notAvailableLinkText'})}
                </a>
            </h1>
        </div>
    );
}
