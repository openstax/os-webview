import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/helpers/cms-fetch';

const adoptionName = '[name="Adoption_Status__c"]';

export const adoptionOptions = [{
    key: 'core',
    value: 'As the core textbook for my course'
}, {
    key: 'recommended',
    value: 'As an optional/recommended textbook for my course'
}, {
    key: 'outside',
    value: 'To teach, tutor, or support students outside of a course setting'
}, {
    key: 'self',
    value: 'For my own knowledge or other work'
}] as const;

function adoption(options: string[]) {
    return adoptionOptions.filter((option) => options.includes(option.key));
}

const initialContextValue = {adoption, adoptionName};

type SalesforceFormsData = {
    oid: string;
    debug: boolean;
    posting_url: string;
    webtoleadUrl: string;
    adoption_form_posting_url: string;
    interest_form_posting_url: string;
    tech_scout_form_posting_url: string;
}

type TransformedSFData = typeof initialContextValue
    & Partial<
        Pick<SalesforceFormsData, 'oid' | 'debug' | 'webtoleadUrl'>
        & {
            webtocaseUrl: string;
            adoptionUrl: string;
            interestUrl: string;
            techScoutUrl: string;
        }
    >

const fetchPromise = cmsFetch('salesforce/forms/');

export function useContextValue() {
    const [value, setValue] = useState<TransformedSFData>(initialContextValue);

    useEffect(() => {
        fetchPromise
            .then((sfData: [SalesforceFormsData]) => {
                const {
                    oid, debug, posting_url: webtoleadUrl,
                    adoption_form_posting_url: adoptionUrl,
                    interest_form_posting_url: interestUrl,
                    tech_scout_form_posting_url: techScoutUrl
                } = sfData[0];
                const webtocaseUrl = webtoleadUrl.replace('ToLead', 'ToCase');

                setValue({
                    ...initialContextValue,
                    oid, debug, webtoleadUrl, webtocaseUrl,
                    adoptionUrl, interestUrl, techScoutUrl
                });
            });
    }, []);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SalesforceContextProvider
};
