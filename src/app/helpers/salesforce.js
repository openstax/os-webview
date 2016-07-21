import {adoptionName, adoptionOptions} from '~/models/salesforce';

const salesforce = {};

salesforce.populateAdoptionStatusOptions = (
    function adoptionStatus() {
        const optionByKey = {};

        for (const opt of adoptionOptions) {
            optionByKey[opt.key] = opt;
        }

        return function (el, keyList, useQtext) {
            const availableOptionList = (keyList) ? keyList.map((key) => optionByKey[key]) : adoptionOptions;
            const asOptions = availableOptionList.map((data) => {
                const opt = document.createElement('option');

                opt.value = data.value;
                opt.textContent = useQtext && data.qtext || data.text;

                return opt;
            });
            const adoptionStatusSelect = el.querySelector(adoptionName);

            for (const opt of asOptions) {
                adoptionStatusSelect.add(opt);
            }
        };
    }
)();

export default salesforce;
