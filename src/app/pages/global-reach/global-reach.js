import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import Map from './map/map';
import Statistics from './statistics/stat';
import StudentInfo from './studentinfo/studentinfo';
import SchoolMap from './schoolmap/schoolmap';

function preprocessData(data) {
    return $.camelCaseKeys(
        Reflect.ownKeys(data).reduce((result, key) => {
            const value = data[key];
            const matches = key.match(/(section_.)_(.*)/);

            if (matches) {
                const [_, sectionKey, newKey] = matches;

                if (!(sectionKey in result)) {
                    result[sectionKey] = {};
                }
                result[sectionKey][newKey] = value;
            } else {
                result[key] = value;
            }
            return result;
        }, {})
    );
}

function GlobalReachPage({data}) {
    const ppData = preprocessData(data);

    return (
        <React.Fragment>
            <Map title={ppData.title} buttonText={ppData.headerText} imageUrl={ppData.mapImageUrl} />
            <Statistics {...ppData.section1} />
            <StudentInfo {...ppData.section2} />
            <SchoolMap {...ppData.section3} />
        </React.Fragment>
    );
}

const slug = 'pages/global-reach';
const view = {
    classes: ['global-reach', 'page'],
    tag: 'main'
};

function GlobalReachLoader() {
    return (
        <LoaderPage slug={slug} Child={GlobalReachPage} />
    );
}

export default pageWrapper(GlobalReachLoader, view);
