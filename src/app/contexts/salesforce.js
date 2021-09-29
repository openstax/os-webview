import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/models/cmsFetch';

const adoptionName = '[name="Adoption_Status__c"]';
const adoptionOptions = [{
    key: 'adopted',
    value: 'Confirmed Adoption Won',
    text: 'Fully adopted and using it as our main text.',
    qtext: 'Yes, I am using OpenStax as a primary resource in my courses'
}, {
    key: 'piloting',
    value: 'Piloting book this semester',
    text: 'Piloting the book this semester.'
}, {
    key: 'recommended',
    value: 'Confirmed Will Recommend',
    text: 'Recommending the book as an option.',
    qtext: 'Yes, I am recommending OpenStax to my students as an optional resource'
}, {
    key: 'interest',
    value: 'High Interest in Adopting',
    text: 'Interested in using it.'
}, {
    key: 'no',
    value: 'Not using',
    text: 'Currently have no plans to use it.',
    qtext: 'No, I\'m not using OpenStax in my courses yet'
}];

function adoption(options) {
    return adoptionOptions.filter((option) => options.includes(option.key));
}

const initialContextValue = {adoption, adoptionName};

function useContextValue() {
    const [value, setValue] = useState(initialContextValue);

    useEffect(() => {
        cmsFetch('salesforce/forms/')
            .then((sfData) => {
                const {oid, debug, posting_url: webtoleadUrl} = sfData[0];
                const webtocaseUrl = webtoleadUrl.replace('ToLead', 'ToCase');

                setValue({...initialContextValue, oid, debug, webtoleadUrl, webtocaseUrl});
            });
    }, []);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SalesforceContextProvider
};
