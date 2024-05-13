import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import useLanguageContext from '~/contexts/language';

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

const slugBase = 'pages/form-headings';

export default function FormHeaderLoader({prefix}) {
    const {language} = useLanguageContext();
    const slug = `${slugBase}?locale=${language}`;

    return (
        <LoaderPage slug={slug} Child={FormHeader} props={{prefix}} />
    );
}
