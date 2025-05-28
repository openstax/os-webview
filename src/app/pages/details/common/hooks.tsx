import {useState, useEffect} from 'react';
import tableOfContentsHtml from '~/models/table-of-contents-html';
import partnerFeaturePromise from '~/models/salesforce-partners';
import shuffle from 'lodash/shuffle';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import useDetailsContext from '../context';
import {useRexPortalLinkOrNot} from '~/helpers/rex-portal';

export function useTableOfContents() {
    const model = useDetailsContext();
    const webviewLink = useRexPortalLinkOrNot(model.webviewRexLink);
    const [tocHtml, setTocHtml] = useState<string>('');

    if (webviewLink) {
        tableOfContentsHtml({
            cnxId: model.cnxId,
            webviewLink
        }).then(setTocHtml, (err) => {
            console.warn(
                `Failed to generate table of contents HTML for ${model.cnxId}: ${err}`
            );
        });
    }

    return tocHtml as string;
}

function toBlurb(partner: PartnerData) {
    const pData = camelCaseKeys(partner) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    return {
        id: pData.id,
        image: pData.partnerLogo,
        name: pData.partnerName,
        description: pData.shortPartnerDescription,
        cost: pData.affordabilityCost,
        type: pData.partnerType,
        url: `/partners?${pData.partnerName}`,
        rating: pData.averageRating?.ratingAvg,
        ratingCount: pData.ratingCount
    };
}

type PartnerData = {
    books: string;
}

export function usePartnerFeatures(bookAbbreviation: string) {
    const [blurbs, setBlurbs] = useState<object[]>([]);
    const [includePartners, setIncludePartners] = useState('');

    useEffect(() => {
        partnerFeaturePromise
            .then((pd: PartnerData[]) => pd.filter((p) => {
                const books = (p.books || '').split(';');

                return books.includes(bookAbbreviation);
            }))
            .then((pd) => {
                if (pd.length > 0) {
                    setIncludePartners('include-partners');
                }
                setBlurbs(shuffle(pd).map(toBlurb));
            });
    }, [bookAbbreviation]);

    return [blurbs, includePartners];
}
