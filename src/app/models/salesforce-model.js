import BaseModel from '~/helpers/backbone/model';

let salesforceModel = new BaseModel();

salesforceModel.prefill = (formElement) => {
    for (let pair of salesforceModel.pairs()) {
        let el = formElement.querySelector(`[name=${pair[0]}]`);

        if (el) {
            el.value = pair[1];
        }
    }
};

export default salesforceModel;
