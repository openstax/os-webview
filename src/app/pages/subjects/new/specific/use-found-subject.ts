import React from 'react';
import {useParams} from 'react-router-dom';
import useSubjectCategoryContext, {ContextValues} from '~/contexts/subject-category';

export default function useFoundSubject() {
    const subject = useParams().subject;
    const categories = useSubjectCategoryContext() as ContextValues;
    const foundSubject = React.useMemo(
        () => categories.find((c) => c.value === subject),
        [subject, categories]
    );

    return foundSubject;
}
