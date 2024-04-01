import React from 'react';
import {WebinarContextProvider} from './webinar-context';
import {Routes, Route} from 'react-router-dom';
import {useCanonicalLink} from '~/helpers/use-document-head';
import JITLoad from '~/helpers/jit-load';
import './webinars.scss';

const importMain = () => import('./import-main-page.js');
const importExplore = () => import('./import-explore-page.js');
const importUpcoming = () => import('./view-webinars-page/upcoming-page.js');
const importLatest = () => import('./view-webinars-page/latest-page.js');
const importSearch = () => import('./import-search-page');


export default function WebinarsLoader() {
    useCanonicalLink();

    return (
        <main className='webinars page'>
            <WebinarContextProvider>
                <Routes>
                    <Route
                        path=''
                        element={<JITLoad importFn={importMain} />}
                    />
                    <Route
                        path='explore/:exploreType/:topic'
                        element={<JITLoad importFn={importExplore} />}
                    />
                    <Route
                        path='upcoming'
                        element={<JITLoad importFn={importUpcoming} />}
                    />
                    <Route
                        path='latest'
                        element={<JITLoad importFn={importLatest} />}
                    />
                    <Route
                        path='search'
                        element={<JITLoad importFn={importSearch} />}
                    />
                </Routes>
            </WebinarContextProvider>
        </main>
    );
}
