import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import { useParams } from 'react-router-dom';
import Subject from './subject/subject';

export default function LoadSubject() {
    const { subject } = useParams();
    const slug = `pages/k12-${subject}`;

    return <LoaderPage slug={slug} Child={Subject} doDocumentSetup />;
}
