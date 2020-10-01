import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Banner from './section/banner';
import Revolution from './section/revolution';
import Founding from './section/founding';
import Reach from './section/reach';
import Testimonials from './section/testimonials';
import Sustainability from './section/sustainability';
import Disruption from './section/disruption';
import LookingAhead from './section/looking-ahead';
import Map from './section/map';
import Tutor from './section/tutor';
import PhilanthropicPartners from './section/philanthropic-partners';
import Giving from './section/giving';
import $ from '~/helpers/$';
import './impact.css';

function preprocessPageData(data) {
    return $.camelCaseKeys(
        Reflect.ownKeys(data)
            .filter((k) => data[k] instanceof Array)
            .reduce((result, k) => {
                const values = data[k];

                result[k] = values.reduce((newEntry, v) => {
                    newEntry[v.type] = v.value;
                    return newEntry;
                }, {});

                return result;
            }, {})
    );
}

function ImpactPage({data}) {
    const ppData = preprocessPageData(data);

    return (
        <React.Fragment>
            <Banner {...ppData.improvingAccess} />
            <Revolution {...ppData.revolution} />
            <Founding {...ppData.founding} />
            <Reach {...ppData.reach} />
            <Testimonials {...ppData.testimonials} />
            <Sustainability {...ppData.sustainability} />
            <Disruption {...ppData.disruption} />
            <LookingAhead {...ppData.lookingAhead} />
            <Map {...ppData.map} />
            <Tutor {...ppData.tutor} />
            <PhilanthropicPartners {...ppData.philanthropicPartners} />
            <Giving {...ppData.giving} />
        </React.Fragment>
    );
}

const slug = 'pages/annual-report';
const view = {
    classes: ['annual-report', 'page'],
    tag: 'main'
};

function ImpactLoader() {
    return (
        <LoaderPage slug={slug} Child={ImpactPage} preserveWrapping={true} doDocumentSetup />
    );
}

export default pageWrapper(ImpactLoader, view);
