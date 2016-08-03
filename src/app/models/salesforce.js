export const adoptionName = '[name="00NU00000055spw"]';
export const adoptionOptions = [{
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

export function adoption(options) {
    return adoptionOptions.filter((option) => options.includes(option.key));
}

const salesforce = {
    adoption,
    adoptionName
};

export default salesforce;
