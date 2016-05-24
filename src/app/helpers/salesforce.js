
let salesforce = {};

salesforce.populateAdoptionStatusOptions = (
    function adoptionStatus() {
        let adoptionStatusSelectSelector = '[name="00NU00000055spw"]',
            optionList = [
                {
                    key: 'adopted',
                    value: 'Confirmed Adoption Won',
                    text: 'Fully adopted and using it as our main text.',
                    qtext: 'Yes, I am using OpenStax as a primary resource in my courses'
                },
                {
                    key: 'piloting',
                    value: 'Piloting book this semester',
                    text: 'Piloting the book this semester.'
                },
                {
                    key: 'recommend',
                    value: 'Confirmed Will Recommend',
                    text: 'Recommending the book as an option. The students purchase a different book.',
                    qtext: 'Yes, I am recommending OpenStax to my students as an optional resource'
                },
                {
                    key: 'interest',
                    value: 'High Interest in Adopting',
                    text: 'Very interested in adopting it.'
                },
                {
                    key: 'no',
                    value: 'Not using',
                    text: 'Currently have no plans to use it.',
                    qtext: 'No, I’m not using OpenStax in my courses yet'
                }
            ],
            optionByKey = {};

        for (let opt of optionList) {
            optionByKey[opt.key] = opt;
        }

        return function (el, keyList, useQtext) {
            let availableOptionList = (keyList) ? keyList.map((key) => optionByKey[key]) : optionList,
                asOptions = availableOptionList.map((data) => {
                    let opt = document.createElement('option');

                    opt.value = data.value;
                    opt.textContent = useQtext && data.qtext || data.text;

                    return opt;
                }),
                adoptionStatusSelect = el.querySelector(adoptionStatusSelectSelector);

            for (let opt of asOptions) {
                adoptionStatusSelect.add(opt);
            }
        };
    }
)();

export default salesforce;
