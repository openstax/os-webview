import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import {camelCaseKeys, Json} from '~/helpers/page-data-utils';
import Map from './map/map';
import Statistics, {CardData} from './statistics/stat';
import StudentInfo, {StudentData} from './studentinfo/studentinfo';
import SchoolMap from './schoolmap/schoolmap';

type RawData = Record<string, Json>;
type ProcessedData = {
    title: string;
    headerText: string;
    mapImageUrl: string;
    section1: {cards: CardData[]};
    section2: StudentData;
    section3: Parameters<typeof SchoolMap>[0];
};

function preprocessData(data: RawData) {
    return camelCaseKeys(
        Object.keys(data).reduce(
            (result, key) => {
                const value = data[key];
                const matches = key.match(/(section_.)_(.*)/);

                if (matches) {
                    const [_, sectionKey, newKey] = matches;

                    if (!(sectionKey in result)) {
                        result[sectionKey] = {};
                    }
                    (result[sectionKey] as Record<string, Json>)[newKey] =
                        value;
                } else {
                    result[key] = value;
                }
                return result;
            },
            {} as Record<string, Json>
        )
    ) as ProcessedData;
}

function GlobalReachPage({data}: {data: RawData}) {
    const ppData = preprocessData(data);

    return (
        <React.Fragment>
            <Map
                title={ppData.title}
                buttonText={ppData.headerText}
                imageUrl={ppData.mapImageUrl}
            />
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
            <LoaderPage
                slug={slug}
                Child={GlobalReachPage}
                noCamelCase
                doDocumentSetup
            />
        </main>
    );
}
