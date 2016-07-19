import settings from 'settings';

const jsonToQueryString = (json) =>
    Object.keys(json).map((key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`
    ).join('&');

const cms = {
    query: (searchOptions) => {
        const url = `${settings.apiOrigin}/api/v1/pages/?format=json&${jsonToQueryString(searchOptions)}`;

        return new Promise((resolve) => fetch(url)
        .then((response) => response.json())
        .then(resolve));
    }
};

export default cms;
