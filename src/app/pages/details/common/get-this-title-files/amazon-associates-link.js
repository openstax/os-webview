import React from 'react';

const buyprintServer = 'https://buyprint.openstax.org';

export default function useAmazonAssociatesLink(slug) {
    const [data, setData] = React.useState({});

    React.useEffect(() => {
        fetch(`${buyprintServer}/${slug}.json`)
            .then((response) => response.json())
            .then(({buy_urls: urls}) => setData(urls[0]));
    }, [slug]);

    return data;
}
