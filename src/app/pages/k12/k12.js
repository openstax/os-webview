import React from 'react';
import {Routes, Route} from 'react-router-dom';
import JITLoad from '~/helpers/jit-load';

const importAllSubjects = () => import('./all-subjects/all-subjects.js');
const importSubject = () => import('./subject/subject.js');

export default function K12Router() {
    return (
        <Routes>
            <Route path="" element={<JITLoad importFn={importAllSubjects} />} />
            <Route path=":subject" element={<JITLoad importFn={importSubject} />} />
        </Routes>
    );
}
