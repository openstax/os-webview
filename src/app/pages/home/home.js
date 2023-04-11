import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad, {forceCheck} from 'react-lazyload';
import Banner from './banner/banner';
import Features from './features/features';
import Quotes from './quotes/quotes';
import WhatsOpenStax from './whats-openstax/whats-openstax';
import Map from './map/map';
import './home.scss';

const slug = 'pages/openstax-homepage';

function uncapitalizeInitial(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
}

function Homepage({data: ungroupedData}) {
    const data = React.useMemo(
        () => {
            const keys = Reflect.ownKeys(ungroupedData);
            const result = {};

            // Group the data by section prefixes
            ['banner', 'features', 'quotes', 'whatsOpenstax', 'map'].forEach((sectionName) => {
                const sectionKeys = keys.filter((k) => k.startsWith(sectionName));

                result[sectionName] = sectionKeys.reduce((a, b) => {
                    const newKey = uncapitalizeInitial(b.substr(sectionName.length)) || sectionName;
                    const value = ungroupedData[b];
                    const imageValue = value?.meta?.downloadUrl;

                    a[newKey] = imageValue || value;
                    return a;
                }, {});
            });
            return result;
        },
        [ungroupedData]
    );

    // Ensure any lazyloaded sections that are visible know it
    React.useEffect(forceCheck);

    return (
        <React.Fragment>
            <Banner data={data.banner} />
            <Features data={data.features} />
            <LazyLoad once offset={100} height={400}>
                <Quotes data={data.quotes} />
            </LazyLoad>
            <LazyLoad once offset={100} height={400}>
                <WhatsOpenStax data={data.whatsOpenstax} />
            </LazyLoad>
            <LazyLoad once offset={100} height={400}>
                <Map data={data.map} />
            </LazyLoad>
        </React.Fragment>
    );
}

export default function HomepageLoader() {
    return (
        <main className="home page">
            <LoaderPage slug={slug} Child={Homepage} doDocumentSetup />
        </main>
    );
}
