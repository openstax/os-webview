import React from 'react';
import usePageContext from '../page-context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import Inquiries from './inquiries';
import Leadership from './leadership';

export default function MissionStatements() {
    const pageData = usePageContext();

    if (!pageData) {
        return null;
    }

    const missionStatements = pageData.missionStatements.map(
        (obj) => obj.statement
    );

    return (
        <div className='content-block'>
            <div>
                <h2>Our mission</h2>
                {missionStatements.map((html) => (
                    <RawHTML html={html} key={html} />
                ))}
            </div>
            <Inquiries />
            <Leadership />
        </div>
    );
}
