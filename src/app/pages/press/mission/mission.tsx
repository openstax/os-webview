import React from 'react';
import {assertDefined} from '~/helpers/data';
import usePageContext from '../page-context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import Inquiries from './inquiries';
import Leadership from './leadership';

export default function MissionStatements() {
    const {missionStatements} = assertDefined(usePageContext());

    return (
        <div className="content-block">
            <div>
                <h2>Our mission</h2>
                {missionStatements.map(({statement: html}) => (
                    <RawHTML html={html} key={html} />
                ))}
            </div>
            <Inquiries />
            <Leadership />
        </div>
    );
}
