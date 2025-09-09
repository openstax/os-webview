import React from 'react';
import {useToggle} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import Controls from './controls/controls';
import MobileControlRow from './mobile-controls/mobile-controls';
import Results, {costOptions} from './results/results';
import {useLocation} from 'react-router-dom';
import {SearchContextProvider} from './search-context';
import type {OptionType} from '~/components/form-elements/form-elements';
import './partners.scss';

function Confirmation() {
    const location = useLocation();
    const bookSlug = location.state?.slug;
    const [done, toggleDone] = useToggle();

    if (done) {
        return null;
    }

    return (
        <section className="above-the-banner">
            <div className="content">
                <div>
                    Thank you! Your form has been submitted. Check out some of
                    the resources available for our books below
                    {bookSlug && (
                        <span>
                            {' '}
                            or return to{' '}
                            <a href={`/details/${bookSlug}`}>your book</a>
                        </span>
                    )}
                    .
                </div>
                <button
                    type="button"
                    className="put-away"
                    aria-label="close confirmation"
                    onClick={() => toggleDone(true)}
                >
                    &times;
                </button>
            </div>
        </section>
    );
}

type PartnerPageData = {
    title: string;
    heading: string;
    description: string;
    partner_landing_page_link: string;
    partner_request_info_link: string;
    partner_full_partner_heading: string;
    partner_full_partner_description: string;
    partner_ally_heading: string;
    partner_ally_description: string;
    category_mapping: {[label: string]: string};
    field_name_mapping: {[label: string]: string};
    partner_type_choices: string[];
};

function getFilterOptions(data: PartnerPageData) {
    const excludeList = ['Book', 'Type'];
    const categoryKeys = Object.keys(data.category_mapping).filter(
        (title) => !excludeList.includes(title)
    );
    const result = categoryKeys.map((title) => ({
        title,
        options: [] as Array<OptionType>
    }));
    const mapToTitle = categoryKeys
        .map((k) => [k, data.category_mapping[k]])
        .reduce(
            (obj, [text, prefix]) => {
                obj[prefix] = text;
                return obj;
            },
            {} as Record<string, string>
        );

    Object.entries(data.field_name_mapping).forEach(([label, value]) => {
        const entry: OptionType = {
            label,
            value
        };
        const categoryPrefix = Object.keys(mapToTitle).find(
            (prefix) => value.substring(0, prefix.length) === prefix
        );
        const itemInResult =
            categoryPrefix &&
            result.find((obj) => obj.title === mapToTitle[categoryPrefix]);

        if (itemInResult) {
            if (label === 'Cost per semester') {
                costOptions.forEach((opt) => itemInResult.options.push(opt));
            } else {
                itemInResult.options.push(entry);
            }
        }
    });

    return result;
}

function textsFromData(data: PartnerPageData) {
    const linkTexts = {
        websiteLinkText: data.partner_landing_page_link,
        infoLinkText: data.partner_request_info_link || 'Request info'
    };

    return {linkTexts};
}

function Partners({data}: {data: PartnerPageData}) {
    const location = useLocation();
    const {confirmation} = location.state || {};
    const advancedFilterOptions = React.useMemo(
        () => getFilterOptions(data),
        [data]
    );
    const typeOptions = React.useMemo(
        () =>
            data.partner_type_choices.sort().map((k) => ({
                label: k,
                value: k
            })),
        [data]
    );
    const headline = data.heading;
    const description = data.description;
    const {linkTexts} = textsFromData(data);

    return (
        <React.Fragment>
            {confirmation && <Confirmation />}
            <section className="banner hero">
                <div className="boxed">
                    <div className="text-block">
                        <h1>{headline}</h1>
                        <RawHTML html={description} />
                        <div className="button-row">
                            <a
                                className="btn primary"
                                href="/openstax-ally-technology-partner-program"
                            >
                                Apply now
                            </a>
                            <a
                                className="btn"
                                href="/webinars/explore/collections/Ally%20Partners"
                            >
                                Watch webinars
                            </a>
                        </div>
                    </div>
                </div>
                <div className="right-bg clipped-image" />
            </section>
            <section>
                <div className="text-content">
                    <h2>
                        Search our technology partners to find the best option
                        for your course
                    </h2>
                    <Controls {...{advancedFilterOptions, typeOptions}} />
                </div>
                <MobileControlRow {...{advancedFilterOptions, typeOptions}} />
            </section>
            <div className="padding" data-analytics-content-list={headline}>
                <Results linkTexts={linkTexts} />
            </div>
        </React.Fragment>
    );
}

export default function PartnersLoader() {
    return (
        <main className="partners page">
            <SearchContextProvider>
                <LoaderPage
                    slug="pages/partners"
                    Child={Partners}
                    doDocumentSetup
                    noCamelCase
                />
            </SearchContextProvider>
        </main>
    );
}
