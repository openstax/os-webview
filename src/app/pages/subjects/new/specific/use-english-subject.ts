import React from 'react';
import { useSubjectCategoriesForLocale } from '~/contexts/subject-category';
import useFoundSubject from './use-found-subject';
import useTranslations from './use-translations';

/*
    If there is an English translation of the page, try to get
    the English Subject Category
    Default to the Subject Category for the current language
*/
export default function useEnglishSubject() {
    const defaultFoundSubject = useFoundSubject();
    const translations = useTranslations();
    const categories = useSubjectCategoriesForLocale('en');
    const foundSubject = React.useMemo(
        () => {
            if (translations) {
                const enTranslation = translations.find((t) => t.locale === 'en');

                if (enTranslation) {
                    const subjectValue = enTranslation.slug.replace('-books', '');

                    return categories.find((c) => c.value === subjectValue);
                }
            }
            return defaultFoundSubject;
        },
        [categories, defaultFoundSubject, translations]
    );

    return foundSubject?.cms;
}

