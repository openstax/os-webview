import React from 'react';
import ResultGrid from './result-grid';
import useSearchContext from '../search-context';
import partnerFeaturePromise from '~/models/salesforce-partners';
import {useDataFromPromise} from '~/helpers/page-data-utils';
import SelectedPartnerDialog from './selected-partner-dialog';
import shuffle from 'lodash/shuffle';
import orderBy from 'lodash/orderBy';
import './results.scss';
import {differenceInYears} from 'date-fns';

export const costOptions = ['$0 - $10', '$11 - $25', '$26 - $40', '> $40'].map(
    (label) => ({
        label,
        value: label.replace(/ /g, '')
    })
);
const costOptionValues = costOptions.map((entry) => entry.value);

export const equityOptions = ['Best', 'Good', 'Needs Improvement'].map(
    (label) => ({
        label,
        value: label
    })
);
const equityOptionValues = equityOptions.map((entry) => entry.value);

type PartnerData = {
    id: number;
    average_rating: {
        rating__avg: number;
    };
    rating_count: number;
    salesforce_id: string;
    partner_name: string;
    partner_logo: string | null;
    image_1: string | null;
    image_2: string | null;
    image_3: string | null;
    image_4: string | null;
    image_5: string | null;
    video_1: string | null;
    video_2: string | null;
    visible_on_website: boolean;
    partner_type: string | null;
    rich_description: string | null;
    partner_description: string | null;
    short_partner_description: string | null;
    partner_website: string | null;
    books: string;
    landing_page: string | null;
    partner_sf_account_id: string;
    affordability_cost: string;
    affordability_institutional: boolean;
    app_available: boolean;
    instructional_level_k12: boolean;
    instructional_level_higher_ed: boolean;
    international: boolean;
    partnership_level: string;
    equity_rating: string | null;
    partner_anniversary_date: string | null;
};

export type PartnerEntry = ReturnType<typeof resultEntry>;

// The key domains need to be done
export type LinkTexts = {
    [key: string]: string;
};
export type HeaderTexts = {
    [key: string]: string;
};

type BooksType = ReturnType<typeof useSearchContext>['books'];
type TypesType = ReturnType<typeof useSearchContext>['types'];

function filterByBooks(candidates: PartnerEntry[], books: BooksType) {
    if (books.value.length <= 0) {
        return candidates;
    }
    return candidates.filter((entry) => {
        return entry.books.find((title) => books.includes(title));
    });
}

function filterByType(candidates: PartnerEntry[], types: TypesType) {
    if (!types.value) {
        return candidates;
    }
    return candidates.filter((entry) => {
        return (
            types.value.localeCompare(entry.type, 'en', {
                sensitivity: 'base'
            }) === 0
        );
    });
}

type AdvancedType = ReturnType<typeof useSearchContext>['advanced'];

// Custom advanced filter handling
function filterBy(
    values: string[],
    candidates: PartnerEntry[],
    candidateField: keyof PartnerEntry,
    advanced: AdvancedType
) {
    const features = advanced.value.filter((f) => values.includes(f));

    if (!features.length) {
        return candidates;
    }
    return candidates.filter((entry) => {
        const v = entry[candidateField] || '';

        // Includes because for costs, the value is a semicolon-separated list
        return features.some((f) => (v as unknown[]).includes(f));
    });
}

// eslint-disable-next-line complexity
function useFilteredEntries(entries: PartnerEntry[]) {
    const {books, types, advanced, sort, resultCount} = useSearchContext();
    const unfilteredResults = React.useMemo(
        () => shuffle(entries),
        [entries]
    );
    const finalResult = React.useMemo(() => {
        let result = filterByBooks(unfilteredResults, books);

        result = filterByType(result, types);

        if (advanced.value.length > 0) {
            result = result.filter((entry) => {
                return advanced.value
                    .filter((feature) => !costOptionValues.includes(feature))
                    .filter((feature) => !equityOptionValues.includes(feature))
                    .every((requiredFeature) =>
                        entry.advancedFeatures.includes(requiredFeature)
                    );
            });
            result = filterBy(costOptionValues, result, 'cost', advanced);
            result = filterBy(
                equityOptionValues,
                result,
                'equityRating',
                advanced
            );
        }

        return result;
    }, [unfilteredResults, advanced, books, types]);

    resultCount.setValue(finalResult.length);

    return React.useMemo(() => {
        if (Math.abs(sort.value) === 0) {
            return finalResult;
        }

        const getFieldsDict = {
            '1': [(r: PartnerEntry) => r.title.toLowerCase()],
            '2': [
                (r: PartnerEntry) => Math.abs(r.rating),
                (r: PartnerEntry) => r.ratingCount
            ]
        };
        const sortDir = sort.value < 0 ? 'desc' : 'asc';

        return orderBy(
            finalResult,
            getFieldsDict[Math.abs(sort.value) as unknown as '1' | '2'],
            [sortDir, sortDir]
        );
    }, [finalResult, sort.value]);
}

function advancedFilterKeys(partnerEntry: PartnerData) {
    return (Object.keys(partnerEntry) as Array<keyof PartnerData>).filter(
        (k) => ([false, true] as unknown[]).includes(partnerEntry[k])
    );
}

// eslint-disable-next-line complexity
function resultEntry(pd: PartnerData) {
    return {
        id: pd.id,
        title: pd.partner_name,
        blurb: pd.short_partner_description || '[no description]',
        tags: [
            {
                label: 'type',
                value: pd.partner_type
            },
            {
                label: 'cost',
                value: pd.affordability_cost
            },
            {
                label: 'equity',
                value: pd.equity_rating
            }
        ].filter((v) => Boolean(v.value)),
        richDescription:
            pd.rich_description ||
            pd.partner_description ||
            '[no rich description]',
        logoUrl: pd.partner_logo,
        books: (pd.books || '').split(/;/),
        advancedFeatures: advancedFilterKeys(pd).filter((k) => pd[k] === true),
        website: pd.landing_page,
        partnerWebsite: pd.partner_website,
        images: [
            pd.image_1,
            pd.image_2,
            pd.image_3,
            pd.image_4,
            pd.image_5
        ].filter((img) => Boolean(img)),
        videos: [pd.video_1, pd.video_2].filter((vid) => Boolean(vid)),
        type: pd.partner_type,
        cost: pd.affordability_cost,
        equityRating: pd.equity_rating,
        rating: pd.average_rating.rating__avg,
        ratingCount: pd.rating_count,
        partnershipLevel: pd.partnership_level,
        yearsAsPartner: pd.partner_anniversary_date
            ? differenceInYears(Date.now(), new Date(pd.partner_anniversary_date))
            : null
    };
}

type Ages = '10' | '7' | '4' | '1' | 'new';

function ResultGridLoader({
    partnerData,
    linkTexts
}: {
    partnerData: PartnerData[];
    linkTexts: LinkTexts;
}) {
    const entries = React.useMemo(
        () => partnerData.map(resultEntry),
        [partnerData]
    );
    const filteredEntries = useFilteredEntries(entries);
    const ages: Ages[] = ['10', '7', '4', '1'];
    const headings: Record<Ages, string> = {
        '10': '10+ years as Technology Partners',
        '7': '7-10 years as partners',
        '4': '4-7 years as partners',
        '1': '1-3 years as partners',
        new: 'New partners'
    };
    const partnersByAge = filteredEntries.reduce((a, b) => {
        const bucket =
            ages.find((age) => (b.yearsAsPartner ?? 0) >= Number(age)) ?? 'new';

        if (!a[bucket]) {
            a[bucket] = [];
        }
        a[bucket].push(b);
        return a;
    }, {} as Record<string, PartnerEntry[]>);

    return (
        <React.Fragment>
            {([...ages, 'new'] as Ages[])
                .filter((age) => age in partnersByAge)
                .map((age) => (
                    <React.Fragment key={age}>
                        <h2>{headings[age as Ages]}</h2>
                        <ResultGrid entries={partnersByAge[age]} />
                    </React.Fragment>
                ))}
            <SelectedPartnerDialog
                linkTexts={linkTexts}
                entries={filteredEntries}
            />
        </React.Fragment>
    );
}

export default function Results({linkTexts}: {linkTexts: LinkTexts}) {
    const partnerData: PartnerData[] = useDataFromPromise(
        partnerFeaturePromise
    );
    const visiblePartners = React.useMemo(
        () => partnerData?.filter((e) => e.visible_on_website),
        [partnerData]
    );


    if (!partnerData) {
        return null;
    }

    return (
        <section className="results boxed">
            <ResultGridLoader {...{partnerData: visiblePartners, linkTexts}} />
        </section>
    );
}