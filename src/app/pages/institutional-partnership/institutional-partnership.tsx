import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import Banner, {BannerProps} from './sections/banner/banner';
import OverlappingQuote, {
    OverlappingQuoteProps
} from './sections/overlapping-quote/overlapping-quote';
import About, {AboutProps} from './sections/about/about';
import Promoting, {PromotingProps} from './sections/promoting/promoting';
import BigQuote, {BigQuoteProps} from './sections/big-quote/big-quote';
import Speaking, {SpeakingProps} from './sections/speaking/speaking';
import Results, {ResultsProps} from './sections/results/results';
import Participants, {
    ParticipantsProps
} from './sections/participants/participants';
import SmallQuote, {SmallQuoteProps} from './sections/small-quote/small-quote';
import SignUp, {SignUpProps} from './sections/sign-up/sign-up';
import './institutional-partnership.scss';

type DataObject = Record<string, unknown>;

type ImageMeta = {
    download_url: string;
};

type SectionData = {
    section_4_background_image: {
        meta: ImageMeta;
    };
} & DataObject;

function unprefixKey(
    newObject: DataObject,
    oldKey: string,
    prefix: string,
    data: DataObject
) {
    const newKey = oldKey.replace(prefix, '');

    newObject[newKey] = data[oldKey];
    return newObject;
}

function sectionData(data: DataObject, sectionNumber: string | number) {
    const sectionPrefix = `section_${sectionNumber}_`;

    return camelCaseKeys(
        Reflect.ownKeys(data)
            .filter((k) => String(k).startsWith(sectionPrefix))
            .reduce(
                (a, oldKey) =>
                    unprefixKey(a, String(oldKey), sectionPrefix, data),
                {}
            )
    );
}

function quoteData(data: DataObject) {
    return Reflect.ownKeys(data)
        .filter((k) => String(k).startsWith('quote'))
        .reduce(
            (a, oldKey) => unprefixKey(a, String(oldKey), 'quote_', data),
            {}
        );
}

function InstitutionalPartnership({data}: {data: SectionData}) {
    return (
        <React.Fragment>
            <Banner {...(sectionData(data, 1) as BannerProps)} />
            <OverlappingQuote {...(quoteData(data) as OverlappingQuoteProps)} />
            <About {...(sectionData(data, 2) as AboutProps)} />
            <LazyLoad>
                <Promoting {...(sectionData(data, 3) as PromotingProps)} />
                <BigQuote
                    {...{
                        backgroundImage:
                            data.section_4_background_image.meta.download_url,
                        ...(sectionData(data, '4_quote') as Omit<
                            BigQuoteProps,
                            'backgroundImage'
                        >)
                    }}
                />
            </LazyLoad>
            <LazyLoad>
                <Speaking {...(sectionData(data, 5) as SpeakingProps)} />
                <Results {...(sectionData(data, 6) as ResultsProps)} />
            </LazyLoad>
            <LazyLoad>
                <Participants
                    {...(sectionData(data, 7) as ParticipantsProps)}
                />
                <SmallQuote
                    {...(sectionData(data, '8_quote') as SmallQuoteProps)}
                />
            </LazyLoad>
            <LazyLoad>
                <SignUp {...(sectionData(data, 9) as SignUpProps)} />
            </LazyLoad>
        </React.Fragment>
    );
}

const slug = 'pages/institutional-partners';

export default function PageLoader() {
    return (
        <main className="institutional-partnership page">
            <LoaderPage
                slug={slug}
                Child={InstitutionalPartnership}
                doDocumentSetup
                noCamelCase
            />
        </main>
    );
}
