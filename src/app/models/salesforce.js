import $ from '~/helpers/$';
import cmsFetch from './cmsFetch';
import React, {useState, useEffect} from 'react';

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
    text: 'Recommending the book as an option. The students purchase a different book.',
    qtext: 'Yes, I am recommending OpenStax to my students as an optional resource'
}, {
    key: 'interest',
    value: 'High Interest in Adopting',
    text: 'Very interested in adopting it.'
}, {
    key: 'no',
    value: 'Not using',
    text: 'Currently have no plans to use it.',
    qtext: 'No, I\'m not using OpenStax in my courses yet'
}];

function adoption(options) {
    return adoptionOptions.filter((option) => options.includes(option.key));
}

export const salesforce = {
    adoption,
    adoptionName
};

const salesforcePromise = cmsFetch('salesforce/forms/').then((sfData) => {
    const {oid, debug, posting_url: webtoleadUrl} = sfData[0];

    Object.assign(salesforce, {
        oid,
        debug,
        webtoleadUrl
    });

    return salesforce;
});

export function salesforceLoadedState() {
    const [sfLoaded, setSfLoaded] = useState(false);

    useEffect(() => {
        salesforcePromise.then(() => setSfLoaded(true));
    }, []);

    return sfLoaded;
}

export default salesforcePromise;
