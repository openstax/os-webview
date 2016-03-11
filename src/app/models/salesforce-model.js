let salesforceModel = {
        attributes: {},
        set: (key, value) => {
            salesforceModel.attributes[key] = value;
            let encodedValue = window.btoa(value);

            document.cookie = `salesforce.${key}=${encodedValue}`;
        }
    },
    cookies = document.cookie.split(/;\s*/);

for (let c of cookies) {
    let qualifiedkey, value;

    [qualifiedkey, value] = c.split('=');
    let qualifier, key;

    [qualifier, key] = qualifiedkey.split('.');
    if (qualifier === 'salesforce') {
        salesforceModel.set(key, window.atob(value));
    }
}

salesforceModel.prefill = (formElement) => {
    for (let key of Object.keys(salesforceModel.attributes)) {
        let el = formElement.querySelector(`[name=${key}]`);

        if (el) {
            el.value = salesforceModel.attributes[key];
        }
    }
};

export default salesforceModel;
