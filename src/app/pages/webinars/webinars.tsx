import React from 'react';
import {WebinarContextProvider} from './webinar-context';
import {Routes, Route} from 'react-router-dom';
import JITLoad from '~/helpers/jit-load';
import './webinars.scss';

const importMain = () => import('./import-main-page.js');
const importExplore = () => import('./import-explore-page.js');

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
                </Routes>
            </WebinarContextProvider>
        </main>
    );
}
