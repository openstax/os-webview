import React from 'react';
import {Routes, Route} from 'react-router-dom';
import JITLoad from '~/helpers/jit-load';

const importMainPage = () => import('./import-k12-main');
const importSubject = () => import('./import-subject');

export default function K12Router() {
    return (
        <Routes>
            <Route path="" element={<JITLoad importFn={importMainPage} />} />
            <Route path=":subject" element={<JITLoad importFn={importSubject} />} />
        </Routes>
    );
}
