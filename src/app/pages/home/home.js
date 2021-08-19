import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import LazyLoad from 'react-lazyload';
import Banner from './banner/banner';
import Features from './features/features';
import Quotes from './quotes/quotes';
import Tutor from './tutor/tutor';
import WhatsOpenStax from './whats-openstax/whats-openstax';
import './home.scss';

const slug = 'pages/openstax-homepage';

function uncapitalizeInitial(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
}

function Homepage({data: ungroupedData}) {
    const keys = Reflect.ownKeys(ungroupedData);
    const data = {};

    // Group the data by section prefixes
    ['banner', 'features', 'quotes', 'tutor', 'whatsOpenstax'].forEach((sectionName) => {
        const sectionKeys = keys.filter((k) => k.startsWith(sectionName));

        data[sectionName] = sectionKeys.reduce((a, b) => {
            const newKey = uncapitalizeInitial(b.substr(sectionName.length)) || sectionName;
            const value = ungroupedData[b];
            const imageValue = value?.meta?.downloadUrl;

            a[newKey] = imageValue || value;
            return a;
        }, {});
    });

    return (
        <React.Fragment>
            <Banner data={data.banner} />
            <Features data={data.features} />
            <LazyLoad once offset={100} height={400}>
                <Quotes data={data.quotes} />
            </LazyLoad>
            <LazyLoad once offset={100} height={400}>
                <Tutor data={data.tutor} />
            </LazyLoad>
            <LazyLoad once offset={100} height={400}>
                <WhatsOpenStax data={data.whatsOpenstax} />
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
