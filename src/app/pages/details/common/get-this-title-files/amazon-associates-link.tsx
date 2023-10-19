import React from 'react';

const buyprintServer = 'https://buyprint.openstax.org';

type AmazonAssociatesLink = {
    url?: string;
};

export default function useAmazonAssociatesLink(slug: string) {
    const [data, setData] = React.useState<AmazonAssociatesLink>({});

    React.useEffect(() => {
        fetch(`${buyprintServer}/${slug}.json`)
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
