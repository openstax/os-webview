import React from 'react';
import {WebinarContextProvider} from './webinar-context';
import {Routes, Route} from 'react-router-dom';
import JITLoad from '~/helpers/jit-load';
import './webinars.scss';

const importMain = () => import('./import-main-page.js');
const importExplore = () => import('./import-explore-page.js');
const importUpcoming = () => import('./latest-page/upcoming-page.js');
const importPast = () => import('./latest-page/past-page.js');
const importSearch = () => import('./import-search-page');

export default function WebinarsLoader() {
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
                        path='past'
                        element={<JITLoad importFn={importPast} />}
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
