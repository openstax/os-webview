import React from 'react';
import {Routes, Route} from 'react-router-dom';
import JITLoad from '~/helpers/jit-load';

const importMainPage = () => import('./import-k12-main.js');
const importSubject = () => import('./subject/subject.js');

export default function K12Router() {
    return (
        <Routes>
            <Route path="" element={<JITLoad importFn={importMainPage} />} />
            <Route path=":subject" element={<JITLoad importFn={importSubject} />} />
        </Routes>
    );
}
