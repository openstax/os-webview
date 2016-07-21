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
    },
    getPage: (searchOptions) => {
        return new Promise((resolve) => cms.query(searchOptions).then((response) => {
            const url = response.pages[0].meta.detail_url;

            fetch(url).then((response2) => response2.json()).then(resolve);
        }));
    }
};

export default cms;
