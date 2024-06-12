import React from 'react';
import useDetailsContext from '../../../context';
import useAmazonAssociatesLink from '../amazon-associates-link';
import {isRealPrintLink} from '~/pages/details/common/get-this-title-files/options';
import {IntlShape, useIntl} from 'react-intl';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';

export default function useAmazonIframe(slug: string) {
    const {amazonIframe} = useDetailsContext();
    const amazonDataLink = useAmazonAssociatesLink(slug);
    const {formatMessage} = useIntl();

    const iframeCode = React.useMemo(
        () => amazonIframe?.length > 0 ? (`
            ${amazonIframe}
            <div class='blurb'>
                ${amazonDataLink.disclosure || 'As an Amazon Associate we earn from qualifying purchases.'}
            </div>
        `) : null,
        [amazonIframe, amazonDataLink.disclosure]
    );

    return iframeCode ?? amazonButton(amazonDataLink, formatMessage);
}

function amazonButton(
    amazonDataLink: ReturnType<typeof useAmazonAssociatesLink>,
    formatMessage: IntlShape['formatMessage']
) {
    const individual = formatMessage({
        id: 'printcopy.individual',
        defaultMessage: 'Individual'
    });
    const disclosure = formatMessage({
        id: 'printcopy.disclosure',
        defaultMessage: '***'
    });
    const button1Text = formatMessage({
        id: 'printcopy.button1',
        defaultMessage: 'Buy a print copy'
    });

    if (!isRealPrintLink(amazonDataLink.url)) {
        return null;
    }

    return ({
        headerText: individual,
        headerIcon: faUser,
        disclosure:
            disclosure === '***'
                ? amazonDataLink.disclosure
                : disclosure,
        buttonText: button1Text,
        buttonUrl: amazonDataLink.url
    });
}
