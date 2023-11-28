import React from 'react';

const buyprintServer = 'https://buyprint.openstax.org';

type AmazonAssociatesLink = {
    url?: string;
    disclosure?: string;
};

export default function useAmazonAssociatesLink(slug: string) {
    const [data, setData] = React.useState<AmazonAssociatesLink>({});

    React.useEffect(() => {
        const strippedSlug = slug.replace('books/', '');

        fetch(`${buyprintServer}/${strippedSlug}.json`)
            .then((response) => response.json())
            .then(({buy_urls: urls}) => {
                if (urls.length > 0) {
                    setData(urls[0]);
                }
            })
            .catch((err) => console.error(`Fetching buyprint: ${err}`));
    }, [slug]);

    return data;
}
