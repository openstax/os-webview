import React from 'react';
import {Routes, Route} from 'react-router-dom';
import JITLoad from '~/helpers/jit-load';

export default function K12Router() {
    return (
        <Routes>
            <Route path="" element={<JITLoad importFn={() => import('./all-subjects/all-subjects.js')} />} />
            <Route path=":subject" element={<JITLoad importFn={() => import('./subject/subject.js')} />} />
        </Routes>
    );
}
