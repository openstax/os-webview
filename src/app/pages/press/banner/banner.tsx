import React from 'react';
import usePageContext from '../page-context';
import {assertDefined} from '~/helpers/data';
import './banner.scss';

export default function Banner() {
    const {title} = assertDefined(usePageContext());

    return (
        <div className="content-block">
            <div className="hero">
                <h1>{title}</h1>
            </div>
        </div>
    );
}
