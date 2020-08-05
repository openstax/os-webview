import React from 'react';
import {RawHTML, LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './form-header.css';

function FormHeader({data}) {
    const {
        intro_heading: heading,
        intro_description: description
    } = data;

    return (
        <div className="form-header">
            <div className="text-content subhead">
                <h1>{heading}</h1>
                <RawHTML Tag="span" html={description} />
            </div>
        </div>
    );
}

export default function FormHeaderLoader({slug}) {
    return (
        <LoaderPage slug={slug} Child={FormHeader} />
    );
}
