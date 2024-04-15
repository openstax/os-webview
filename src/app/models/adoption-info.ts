import {camelCaseKeys} from '~/helpers/page-data-utils';

export type AdoptionData = {
    adoptions: {
        baseYear: number;
        students: number | null;
        savings: number;
    }[];
};

type WindowWithSettings = typeof window & {
    SETTINGS: {
        accountHref: string;
    };
}
const w = window as WindowWithSettings;
const subdomains = ['staging.'];
const subdomain = subdomains.find((sd) => w.SETTINGS.accountHref?.includes(sd)) || '';
const url = `https://${subdomain}salesforce.openstax.org/api/v1/adoptions`;
const TESTING = process.env.JEST_WORKER_ID !== undefined;
/* eslint-disable camelcase */
const testData = {
    count: 4,
    contact_id: '003U000001pyRebIAE',
    adoptions: [
        {
            id: 'a00Pc000007TWN3IAO',
            book: {
                id: 'a0Z0B00000HPp9eUAD',
                name: 'Business Ethics',
                official_name: 'Introductory Business Ethics',
                type: 'General',
                subject_areas: 'Business',
                website_url:
                    'https://openstax.org/details/books/business-ethics'
            },
            base_year: 2022,
            school_year: '2022 - 23',
            school: 'Test University',
            confirmation_type: 'User Behavior Informed Adoption',
            students: null,
            savings: 0.0,
            how_using: null,
            confirmation_date: '2023-04-03'
        },
        {
            id: 'a00Pc000007TWN4IAO',
            book: {
                id: 'a0ZU0000008pytKMAQ',
                name: 'Biology',
                official_name: 'Biology',
                type: 'General',
                subject_areas: 'Science',
                website_url: 'https://openstax.org/details/books/biology'
            },
            base_year: 2022,
            school_year: '2022 - 23',
            school: 'Test University',
            confirmation_type: 'User Behavior Informed Adoption',
            students: null,
            savings: 0.0,
            how_using: null,
            confirmation_date: '2023-02-21'
        },
        {
            id: 'a00Pc000009o2B8IAI',
            book: {
                id: 'a0ZPc0000011zVVMAY',
                name: 'Calculus Volume 1',
                official_name: 'Calculus Volume 1',
                type: 'General',
                subject_areas: 'Math',
                website_url:
                    'https://openstax.org/details/books/calculus-volume-1'
            },
            base_year: 2023,
            school_year: '2023 - 24',
            school: 'Test University',
            confirmation_type: 'OpenStax Confirmed Adoption',
            students: 50,
            savings: 3968.5,
            how_using: 'As the core textbook for my course',
            confirmation_date: '2024-03-04'
        },
        {
            id: 'a00Pc00000BD2uRIAT',
            book: {
                id: 'a0ZU0000008pyv1MAA',
                name: 'Micro Econ',
                official_name: 'Principles of Microeconomics',
                type: 'General',
                subject_areas: 'Business;Social Sciences',
                website_url:
                    'https://openstax.org/details/books/principles-microeconomics'
            },
            base_year: 2023,
            school_year: '2023 - 24',
            school: 'Test University',
            confirmation_type: 'User Behavior Informed Adoption',
            students: null,
            savings: 0.0,
            how_using: null,
            confirmation_date: '2024-03-26'
        }
    ],
    cache_create: '2024-04-12T16:17:43.345Z',
    cache_expire: '2024-04-12T17:17:43.345Z'
};
const testPromise = Promise.resolve(testData);

export default (TESTING ? testPromise : fetch(url).then((r) => r.json())).then(
    camelCaseKeys
).catch(() => ({}));
