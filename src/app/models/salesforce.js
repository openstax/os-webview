import settings from 'settings';

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

const salesforce = {
    adoption,
    adoptionName,
    salesforceHome: settings.testingEnvironment ? 'test.salesforce.com' : 'webto.salesforce.com',
    oid: settings.testingEnvironment ? '00D0t0000000zUN' : '00DU0000000Kwch'
};

salesforce.webtoleadUrl = `https://${salesforce.salesforceHome}/servlet/servlet.WebToLead?encoding=UTF-8`;

export default salesforce;
