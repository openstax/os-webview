import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
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

export default function GlobalReachLoader() {
    return (
        <main className="global-reach page">
            <LoaderPage slug={slug} Child={GlobalReachPage} noCamelCase doDocumentSetup />
        </main>
    );
}
