import React, {useState, useEffect} from 'react';
import ResultGrid from './result-grid';
import {books, types, advanced, sort, resultCount} from '../store';
import partnerFeaturePromise, {tooltipText} from '~/models/salesforce-partners';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import shuffle from 'lodash/shuffle';
import orderBy from 'lodash/orderBy';
import './results.css';

export const costOptions = [
    'Free - $10',
    '$11 - $25',
    '$26 - $40',
    '> $40'
].map((label) => ({
    label,
    value: label.replace(/ /g, '')
}));

const costOptionValues = costOptions.map((entry) => entry.value);

// eslint-disable-next-line complexity
function filterEntries(entries) {
    let result = entries;

    if (books.value.length > 0) {
        result = result.filter((entry) => {
            return entry.books.find((title) => books.includes(title));
        });
    }

    if (types.value) {
        result = result.filter((entry) => {
            return types.value === entry.type;
        });
    }

    if (advanced.value.length > 0) {
        result = result.filter((entry) => {
            return advanced.value
                .filter((feature) => !costOptionValues.includes(feature))
                .every((requiredFeature) => {
                    return entry.advancedFeatures.includes(requiredFeature);
                });
        });
        const costFeatures = advanced.value
            .filter((feature) => costOptionValues.includes(feature));

        if (costFeatures.length) {
            result = result.filter((entry) => {
                return costFeatures.some((costPossibility) => entry.cost === costPossibility);
            });
        }
    }

    resultCount.value = result.length;
    return ['1', '-1'].includes(sort.value) ?
        orderBy(
            result,
            [(entry) => entry.title.toLowerCase()],
            [(sort.value === '-1' ? 'desc' : 'asc')]
        ) :
        shuffle(result);
}

function advancedFilterKeys(partnerEntry) {
    return Reflect.ownKeys(partnerEntry).filter((k) => [false, true].includes(partnerEntry[k]));
}

// eslint-disable-next-line complexity
function resultEntry(pd) {
    return {
        title: pd.partner_name,
        blurb: pd.short_partner_description ||
            '[no description]',
        tags: [
            {
                label: 'type',
                value: pd.partner_type
            },
            {
                label: 'cost',
                value: pd.affordability_cost
            }
        ].filter((v) => Boolean(v.value)),
        richDescription: pd.rich_description ||
            pd.partner_description ||
            '[no rich description]',
        logoUrl: pd.partner_logo,
        books: (pd.books||'').split(/;/),
        advancedFeatures: advancedFilterKeys(pd).filter((k) => pd[k] === true),
        website: pd.landing_page,
        images: [pd.image_1, pd.image_2, pd.image_3, pd.image_4, pd.image_5]
            .filter((img) => Boolean(img)),
        videos: [pd.video_1, pd.video_2]
            .filter((vid) => Boolean(vid)),
        type: pd.partner_type,
        cost: pd.affordability_cost,
        infoUrl: pd.formstack_url,
        verifiedFeatures: pd.verified_by_instructor ? tooltipText : false
    };
}

function ResultGridLoader({partnerData, linkTexts}) {
    const entries = partnerData.map(resultEntry);
    const [filteredEntries, setFilteredEntries] = useState(filterEntries(entries));

    useEffect(() => {
        function handleNotifyFor(store) {
            return store.on('notify', () => setFilteredEntries(filterEntries(entries)));
        }

        const cleanup = [books, types, advanced, sort].map(handleNotifyFor);

        return () => cleanup.forEach((fn) => fn());
    }, [entries]);

    return (
        <ResultGrid entries={filteredEntries} linkTexts={linkTexts} />
    );
}

export default function Results({linkTexts}) {
    const partnerData = useDataFromPromise(partnerFeaturePromise);

    if (!partnerData) {
        return null;
    }

    return (
        <section className="results">
            <ResultGridLoader {...{partnerData, linkTexts}} />
        </section>
    );
}
