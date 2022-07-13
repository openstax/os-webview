import React from 'react';
import {RawHTML, LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './form-header.scss';

function FormHeader({data, prefix}) {
    const heading = data[`${prefix}IntroHeading`];
    const description = data[`${prefix}IntroDescription`];

    return (
        <div className="form-header">
            <div className="text-content subhead">
                <h1>{heading}</h1>
                <RawHTML Tag="span" html={description} />
            </div>
        </div>
    );
}

const slug = 'pages/form-headings';

export default function FormHeaderLoader({prefix}) {
    return (
        <LoaderPage slug={slug} Child={FormHeader} props={{prefix}} />
    );
}
