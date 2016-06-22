const salesforce = {};

salesforce.populateAdoptionStatusOptions = (
    function adoptionStatus() {
        const adoptionStatusSelectSelector = '[name="00NU00000055spw"]';
        const optionList = [
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
                qtext: 'No, I\'m not using OpenStax in my courses yet'
            }
        ];
        const optionByKey = {};

        for (const opt of optionList) {
            optionByKey[opt.key] = opt;
        }

        return function (el, keyList, useQtext) {
            const availableOptionList = (keyList) ? keyList.map((key) => optionByKey[key]) : optionList;
            const asOptions = availableOptionList.map((data) => {
                const opt = document.createElement('option');

                opt.value = data.value;
                opt.textContent = useQtext && data.qtext || data.text;

                return opt;
            });
            const adoptionStatusSelect = el.querySelector(adoptionStatusSelectSelector);

            for (const opt of asOptions) {
                adoptionStatusSelect.add(opt);
            }
        };
    }
)();

export default salesforce;
