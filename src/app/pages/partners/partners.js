import React from 'react';
import {RawHTML, LoaderPage, useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Controls from './controls/controls';
import MobileControlRow from './mobile-controls/mobile-controls';
import Results, {costOptions} from './results/results';
import './partners.scss';

function Confirmation() {
    const bookSlug = history.state && history.state.slug;
    const [done, toggleDone] = useToggle();

    if (done) {
        return null;
    }

    return (
        <section className="above-the-banner">
            <div className="content">
                <div>
                    Thank you! Your form has been submitted. Check out some of the resources
                    available for our books below
                    {
                        bookSlug &&
                            <span>{' '}or return to{' '}
                                <a href={`/details/${bookSlug}`}>your book</a>
                            </span>
                    }
                    .
                </div>
                <button type="button" className="put-away" onClick={toggleDone}>&times;</button>
            </div>
        </section>
    );
}

function getFilterOptions(data) {
    const excludeList = ['Book', 'Type'];
    const categoryKeys = Reflect.ownKeys(data.category_mapping)
        .filter((title) => !excludeList.includes(title));
    const result = categoryKeys
        .map((title) => ({
            title,
            options: []
        }));
    const mapToTitle = categoryKeys
        .map((k) => [k, data.category_mapping[k]])
        .reduce((obj, [text, prefix]) => {
            obj[prefix] = text;
            return obj;
        }, {});

    Object.entries(data.field_name_mapping)
        .forEach(([label, value]) => {
            const entry = {
                label,
                value
            };
            const categoryPrefix = Reflect.ownKeys(mapToTitle)
                .find((prefix) => value.substr(0, prefix.length) === prefix);
            const itemInResult = result.find((obj) => obj.title === mapToTitle[categoryPrefix]);

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

// eslint-disable-next-line complexity
function textsFromData(data) {
    const linkTexts = {
        websiteLinkText: data.partner_landing_page_link,
        infoLinkText: (data.partner_request_info_link || 'Request info')
    };
    const headerTexts = {
        partnerHeader: data.partner_full_partner_heading || 'Full partners',
        partnerDescription: data.partner_full_partner_description ||
        'Something about what Full Partners are',
        allyHeaader: data.partner_ally_heading || 'Brand allies',
        allyDescription: data.partner_ally_descriptioni ||
        'Something about what Brand Allies are'
    };

    return {linkTexts, headerTexts};
}

function Partners({data}) {
    const {confirmation} = history.state || {};
    const advancedFilterOptions = getFilterOptions(data);
    const typeOptions = data.partner_type_choices
        .sort()
        .map((k) => ({
            label: k,
            value: k
        }));
    const headline = data.heading;
    const description = data.description;
    const {linkTexts, headerTexts} = textsFromData(data);

    return (
        <React.Fragment>
            {confirmation && <Confirmation />}
            <section className="banner hero">
                <div className="boxed">
                    <h1>{headline}</h1>
                    <RawHTML html={description} />
                    <Controls {...{advancedFilterOptions, typeOptions}} />
                </div>
                <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            </section>
            <MobileControlRow {...{advancedFilterOptions, typeOptions}} />
            <div className="padding">
                <Results linkTexts={linkTexts} headerTexts={headerTexts} />
            </div>
        </React.Fragment>
    );
}

export default function PartnersLoader() {
    return (
        <main className="partners page">
            <LoaderPage slug="pages/partners" Child={Partners} doDocumentSetup noCamelCase />
        </main>
    );
}
