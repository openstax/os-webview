import {useState, useEffect} from 'react';
import tableOfContentsHtml from '~/models/table-of-contents-html';
import partnerFeaturePromise, {tooltipText} from '~/models/salesforce-partners';
import shuffle from 'lodash/shuffle';
import $ from '~/helpers/$';

export function useTableOfContents(model) {
    const webviewLink = model.webviewRexLink || model.webviewLink;
    const isTutor = model.webviewRexLink?.includes('tutor');
    const isRex = !isTutor && Boolean(model.webviewRexLink);
    const [tocHtml, setTocHtml] = useState('');

    tableOfContentsHtml({
        isRex,
        cnxId: model.cnxId,
        bookSlug: model.slug,
        webviewLink,
        isTutor
    }).then(
        setTocHtml,
        (err) => {
            console.warn(`Failed to generate table of contents HTML for ${model.cnxId}: ${err}`);
        }
    );

    return tocHtml;
}

function toBlurb(partner) {
    const pData = $.camelCaseKeys(partner);

    return {
        id: pData.id,
        image: pData.partnerLogo,
        name: pData.partnerName,
        description: pData.shortPartnerDescription,
        cost: pData.affordabilityCost,
        type: pData.partnerType,
        url: `/partners?${pData.partnerName}`,
        verifiedFeatures: pData.verifiedByInstructor ? tooltipText : false,
        rating: pData.averageRating.ratingAvg,
        ratingCount: pData.ratingCount
    };
}

export function usePartnerFeatures(bookAbbreviation) {
    const [blurbs, setBlurbs] = useState([]);
    const [includePartners, setIncludePartners] = useState('');

    useEffect(() => {
        partnerFeaturePromise.then((pd) =>
            pd.filter((p) => {
                const books = (p.books || '').split(';');

                return books.includes(bookAbbreviation);
            })
        ).then((pd) => {
            if (pd.length > 0) {
                setIncludePartners('include-partners');
            }
            setBlurbs(shuffle(pd).map(toBlurb));
        });
    }, [bookAbbreviation]);

    return [blurbs, includePartners];
}
