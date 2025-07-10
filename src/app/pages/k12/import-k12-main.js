import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import K12Main from './k12-main/k12-main';

export default function K12MainLoader() {
    return (
        <LoaderPage slug="pages/k12" Child={K12Main} doDocumentSetup />
    );
}
