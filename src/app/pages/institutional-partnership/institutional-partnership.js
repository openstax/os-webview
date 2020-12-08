import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import Banner from './sections/banner/banner';
import OverlappingQuote from './sections/overlapping-quote/overlapping-quote';
import About from './sections/about/about';
import Promoting from './sections/promoting/promoting';
import BigQuote from './sections/big-quote/big-quote';
import Speaking from './sections/speaking/speaking';
import Results from './sections/results/results';
import Participants from './sections/participants/participants';
import SmallQuote from './sections/small-quote/small-quote';
import SignUp from './sections/sign-up/sign-up';
import StickyFooter from '~/components/sticky-footer/sticky-footer.jsx';
import './institutional-partnership.css';

function unprefixKey(newObject, oldKey, prefix, data) {
    const newKey = oldKey.replace(prefix, '');

    newObject[newKey] = data[oldKey];
    return newObject;
}

function sectionData(data, sectionNumber) {
    const sectionPrefix = `section_${sectionNumber}_`;

    return $.camelCaseKeys(
        Reflect.ownKeys(data)
            .filter((k) => k.startsWith(sectionPrefix))
            .reduce(
                (a, oldKey) => unprefixKey(a, oldKey, sectionPrefix, data), {}
            )
    );
}

function quoteData(data) {
    return Reflect.ownKeys(data)
        .filter((k) => k.startsWith('quote'))
        .reduce(
            (a, oldKey) => unprefixKey(a, oldKey, 'quote_', data), {}
        );
}

function InstitutionalPartnership({data}) {
    const leftButton = {
        descriptionHtml: data.section_1_description,
        text: data.section_1_link_text,
        link: data.section_1_link
    };

    return (
        <React.Fragment>
            <Banner {...sectionData(data, 1)} />
            <OverlappingQuote {...quoteData(data)} />
            <About {...sectionData(data, 2)} />
            <Promoting {...sectionData(data, 3)} />
            <BigQuote
                {...{
                    backgroundImage: data.section_4_background_image.meta.download_url,
                    ...sectionData(data, '4_quote')
                }}
            />
            <Speaking {...sectionData(data, 5)} />
            <Results {...sectionData(data, 6)} />
            <Participants {...sectionData(data, 7)} />
            <SmallQuote {...sectionData(data, '8_quote')} />
            <SignUp {...sectionData(data, 9)} />
            <StickyFooter leftButton={leftButton} />
        </React.Fragment>
    );
}

const view = {
    classes: ['institutional-partnership', 'page'],
    tag: 'main'
};
const slug = 'pages/institutional-partners';

function PageLoader() {
    return (
        <LoaderPage slug={slug} Child={InstitutionalPartnership} doDocumentSetup />
    );
}

export default pageWrapper(PageLoader, view);
